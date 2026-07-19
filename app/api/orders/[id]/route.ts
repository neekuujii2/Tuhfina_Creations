import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';
import { requireAdmin, requireAuth } from '@/lib/auth/requireAdmin';
import { updateOrderSchema } from '@/lib/validations';

/**
 * PUT: Update order status and payment status by ID (admin only)
 */
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        const { id } = params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid Order ID' }, { status: 400 });
        }

        const body = await request.json();

        const parsed = updateOrderSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { status, paymentStatus } = parsed.data;

        await dbConnect();

        const updateData: any = {};
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * GET: Fetch a single order by ID (admin or authenticated user)
 */
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await requireAuth();
        if (!auth.authorized) return auth.response;

        const { id } = params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid Order ID' }, { status: 400 });
        }

        await dbConnect();
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
