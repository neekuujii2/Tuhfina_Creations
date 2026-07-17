import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '@/lib/notificationUtils';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email, password, confirmPassword } = await req.json();

        if (!email || !password || !confirmPassword) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            if (existingUser.isVerified) {
                return NextResponse.json({ error: 'User already exists' }, { status: 400 });
            } else {
                await User.deleteOne({ email: normalizedEmail });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            email: normalizedEmail,
            password: hashedPassword,
            isVerified: false,
        });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 10);

        // Save OTP to DB
        await Otp.findOneAndUpdate(
            { email: normalizedEmail },
            {
                otpHash,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                requestCount: 1,
                lastRequestedAt: new Date()
            },
            { upsert: true, new: true }
        );

        // Send OTP via Email
        await sendOtpEmail(normalizedEmail, otp);

        return NextResponse.json({
            message: 'OTP sent to your email. Please verify.',
            email: normalizedEmail
        }, { status: 201 });

    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
}
