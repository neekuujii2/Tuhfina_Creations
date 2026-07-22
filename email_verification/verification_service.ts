import { generateVerificationToken } from './token_generator';
import { saveVerificationToken, getVerificationToken, deleteVerificationToken } from './verification_repository';
import { sendVerificationEmail } from './email_sender';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

const TOKEN_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function initiateVerification(email: string): Promise<void> {
    try {
        const token = generateVerificationToken();
        await saveVerificationToken(email, token, TOKEN_EXPIRATION_MS);

        // Generate the verification URL
        // Fallback to localhost if APP_URL is not defined in env
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || 'http://localhost:3000';
        const verificationLink = `${appUrl}/api/custom-verification/verify?token=${token}`;

        await sendVerificationEmail(email, verificationLink);
    } catch (error) {
        console.error('[EmailVerification] Failed to initiate verification:', error);
        throw error;
    }
}

export async function verifyTokenAndActivateAccount(token: string): Promise<boolean> {
    try {
        const tokenRecord = await getVerificationToken(token);

        if (!tokenRecord) {
            console.warn('[EmailVerification] Token not found or already used.');
            return false;
        }

        if (new Date() > tokenRecord.expiresAt) {
            console.warn('[EmailVerification] Token has expired.');
            // Cleanup expired token
            await deleteVerificationToken(token);
            return false;
        }

        const email = tokenRecord.email;

        // Activate the account in the Better Auth / user database
        await dbConnect();
        
        // Better auth stores users in the 'user' collection
        const db = mongoose.connection.db;
        if (!db) throw new Error('Database connection not established.');
        
        const result = await db.collection('user').updateOne(
            { email: email },
            { $set: { emailVerified: true, isVerified: true } }
        );

        if (result.modifiedCount === 0 && result.matchedCount === 0) {
            console.error(`[EmailVerification] User not found for email: ${email}`);
            return false;
        }

        // Token is single-use, delete it after successful verification
        await deleteVerificationToken(token);
        
        console.info(`[EmailVerification] Successfully verified account for ${email}`);
        return true;
    } catch (error) {
        console.error('[EmailVerification] Error during token verification:', error);
        throw error;
    }
}
