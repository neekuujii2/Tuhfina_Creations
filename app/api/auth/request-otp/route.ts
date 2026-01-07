import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Otp from '@/models/Otp';
import { sendOtpEmail } from '@/lib/notificationUtils';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        await dbConnect();

        // Check rate limit: Max 5 OTP requests per hour per email
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const existingOtp = await Otp.findOne({ email });

        if (existingOtp) {
            // If the last request was within the last hour, check count
            if (existingOtp.lastRequestedAt > oneHourAgo) {
                if (existingOtp.requestCount >= 5) {
                    return NextResponse.json(
                        { error: 'Too many requests. Please try again after an hour.' },
                        { status: 429 }
                    );
                }
                existingOtp.requestCount += 1;
            } else {
                // If it was more than an hour ago, reset count
                existingOtp.requestCount = 1;
            }
            existingOtp.lastRequestedAt = new Date();
        }

        // Generate 6-digit numeric OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        if (existingOtp) {
            existingOtp.otpHash = otpHash;
            existingOtp.expiresAt = expiresAt;
            await existingOtp.save();
        } else {
            await Otp.create({
                email,
                otpHash,
                expiresAt,
                requestCount: 1,
                lastRequestedAt: new Date(),
            });
        }

        // Send OTP via email
        await sendOtpEmail(email, otp);

        return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error in request-otp:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
