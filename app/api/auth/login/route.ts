import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email, password } = await req.json();
        const ADMIN_EMAIL = 'Tuhfinacreations@gmail.com';

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Auto-promote to admin if email matches
        if (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && user.role !== 'ADMIN') {
            user.role = 'ADMIN';
            await user.save();
        }

        if (!user.isVerified) {
            return NextResponse.json({
                error: 'Account not verified. Please check your email for OTP.',
                notVerified: true
            }, { status: 403 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create JWT session
        const sessionPayload = {
            userId: user._id,
            email: user.email,
            role: user.role,
        };

        await createSession(sessionPayload);

        return NextResponse.json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
}
