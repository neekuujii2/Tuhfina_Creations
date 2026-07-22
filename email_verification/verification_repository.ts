import mongoose, { Schema, Document } from 'mongoose';
import dbConnect from '@/lib/mongodb';

export interface IVerificationToken extends Document {
    email: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>({
    email: { type: String, required: true, index: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // Automatically delete documents after 24 hours
});

const VerificationToken = mongoose.models.VerificationToken || mongoose.model<IVerificationToken>('VerificationToken', VerificationTokenSchema);

export async function saveVerificationToken(email: string, token: string, expiresInMs: number): Promise<void> {
    await dbConnect();
    
    // Delete any existing tokens for this email to prevent multiple valid tokens
    await VerificationToken.deleteMany({ email });

    const expiresAt = new Date(Date.now() + expiresInMs);
    await VerificationToken.create({ email, token, expiresAt });
}

export async function getVerificationToken(token: string): Promise<IVerificationToken | null> {
    await dbConnect();
    return VerificationToken.findOne({ token });
}

export async function deleteVerificationToken(token: string): Promise<void> {
    await dbConnect();
    await VerificationToken.deleteOne({ token });
}
