import mongoose, { Schema, model, models } from 'mongoose';

const OtpSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        otpHash: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: '5m' }, // TTL index to auto-delete after 5 minutes
        },
        requestCount: {
            type: Number,
            default: 1,
        },
        lastRequestedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Otp = models.Otp || model('Otp', OtpSchema);

export default Otp;
