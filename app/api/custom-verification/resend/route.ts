import { NextResponse } from 'next/server';
import { initiateVerification } from '@/email_verification/verification_service';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = body.email;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if user exists and is already verified
        await dbConnect();
        const db = mongoose.connection.db;
        if (!db) throw new Error('Database connection not established.');

        const user = await db.collection('user').findOne({ email: email.toLowerCase() });

        if (!user) {
            // For security, don't reveal if user exists or not
            return NextResponse.json({ message: 'If the email exists, a new verification link has been sent.' });
        }

        if (user.emailVerified) {
            return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
        }

        // Generate and send a new verification email
        await initiateVerification(email.toLowerCase());

        return NextResponse.json({ message: 'Verification email sent successfully.' });
    } catch (error) {
        console.error('[ResendAPI] Error sending verification email:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
