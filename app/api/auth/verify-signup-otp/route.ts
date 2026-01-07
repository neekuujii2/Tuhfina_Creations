import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord) {
            return NextResponse.json({ error: 'OTP expired or not found' }, { status: 400 });
        }

        const isOtpValid = await bcrypt.compare(otp, otpRecord.otpHash);
        if (!isOtpValid) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        // Mark user as verified
        const user = await User.findOneAndUpdate(
            { email },
            { isVerified: true },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Delete OTP record
        await Otp.deleteOne({ email });

        return NextResponse.json({
            message: 'Email verified successfully. You can now login.',
            success: true
        }, { status: 200 });

    } catch (error: any) {
        console.error('OTP Verification error:', error);
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
}
