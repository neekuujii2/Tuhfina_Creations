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

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.isVerified) {
                return NextResponse.json({ error: 'User already exists' }, { status: 400 });
            } else {
                // User exists but not verified, we can overwrite or just update OTP
                // For simplicity, let's delete the unverified user and start over
                await User.deleteOne({ email });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            isVerified: false,
        });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 10);

        // Save OTP to DB
        await Otp.findOneAndUpdate(
            { email },
            {
                otpHash,
                expiresAt: new Date(), // TTL will handle deletion after 5 mins
                requestCount: 1,
                lastRequestedAt: new Date()
            },
            { upsert: true, new: true }
        );

        // Send OTP via Email
        await sendOtpEmail(email, otp);

        return NextResponse.json({
            message: 'OTP sent to your email. Please verify.',
            email: email
        }, { status: 201 });

    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
}
