import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        name: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ['ADMIN', 'USER'],
            default: 'USER',
        },
    },
    {
        timestamps: true,
    }
);

const User = models.User || model('User', UserSchema);

export default User;
