import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '@/lib/razorpayConfig';

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
});

export async function POST(request: Request) {
    try {
        const { amount, orderId } = await request.json();

        if (!amount || !orderId) {
            return NextResponse.json(
                { error: 'Amount and Order ID are required' },
                { status: 400 }
            );
        }

        const options = {
            amount: Math.round(amount * 100), // Convert to paise (Razorpay expects paise)
            currency: 'INR',
            receipt: orderId,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
            { error: 'Error creating order' },
            { status: 500 }
        );
    }
}
