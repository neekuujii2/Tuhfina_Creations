import mongoose, { Schema, model, models } from 'mongoose';

const OrderItemSchema = new Schema({
    productId: { type: String },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String },
    customization: {
        type: Schema.Types.Mixed,
        required: false,
    },
});

const OrderSchema = new Schema(
    {
        userId: {
            type: String,
            required: false,
        },
        userEmail: {
            type: String,
            required: [true, 'User email is required'],
        },
        items: {
            type: [OrderItemSchema],
            required: [true, 'Order must have at least one item'],
        },
        totalAmount: {
            type: Number,
            required: [true, 'Total amount is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        paymentStatus: {
            type: String,
            enum: ['PENDING', 'PAID', 'FAILED'],
            default: 'PENDING',
        },
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String },
        invoiceUrl: { type: String },
        shippingAddress: {
            name: String,
            address: String,
            city: String,
            state: String,
            pincode: String,
            phone: String,
        },
    },
    {
        timestamps: true,
    }
);

const Order = models.Order || model('Order', OrderSchema);

export default Order;
