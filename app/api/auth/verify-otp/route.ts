import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Otp from '@/models/Otp';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { email, otp, name } = await req.json();
        const normalizedEmail = email.toLowerCase().trim();

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        await dbConnect();

        const existingOtp = await Otp.findOne({ email: normalizedEmail });

        if (!existingOtp) {
            return NextResponse.json({ error: 'OTP not found or expired' }, { status: 400 });
        }

        // Verify OTP
        const isMatch = await bcrypt.compare(otp, existingOtp.otpHash);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        // Check expiry
        if (new Date() > existingOtp.expiresAt) {
            await Otp.deleteOne({ email: normalizedEmail });
            return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
        }

        // OTP is valid - Now find or create user
        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            const role = normalizedEmail.toLowerCase() === (process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',')[0] || 'Tuhfinacreations@gmail.com').toLowerCase() ? 'ADMIN' : 'USER';
            user = await User.create({
                email: normalizedEmail,
                name: name || 'User',
                role,
            });
        }

        // Create JWT session
        await createSession({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        // Delete OTP after success
        await Otp.deleteOne({ email: normalizedEmail });

        return NextResponse.json({
            message: 'Authentication successful',
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error in verify-otp:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
