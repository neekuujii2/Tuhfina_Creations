import mongoose, { Schema, model, models } from 'mongoose';

const ReturnRequestSchema = new Schema(
    {
        orderId: {
            type: String,
            required: [true, 'Order ID is required'],
        },
        productId: {
            type: String,
            required: [true, 'Product ID is required'],
        },
        reason: {
            type: String,
            required: [true, 'Reason is required'],
        },
        status: {
            type: String,
            enum: ['requested', 'approved', 'rejected', 'refunded'],
            default: 'requested',
        },
        requestedAt: {
            type: Date,
            default: Date.now,
        },
        resolvedAt: {
            type: Date,
            required: false,
        },
        refundAmount: {
            type: Number,
            required: false,
        },
        razorpayRefundId: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const ReturnRequest = models.ReturnRequest || model('ReturnRequest', ReturnRequestSchema);

export default ReturnRequest;
