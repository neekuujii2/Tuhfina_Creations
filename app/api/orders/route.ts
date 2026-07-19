import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdmin, requireAuth } from '@/lib/auth/requireAdmin';
import { updateOrderSchema, bulkUpdateOrderSchema } from '@/lib/validations';
import { getCached, invalidateCache } from '@/lib/cache/redis';

const CACHE_KEY = 'orders:all';
const ORDERS_TTL = 30;

export async function GET(request: Request) {
    try {
        const auth = await requireAuth();
        if (!auth.authorized) return auth.response;

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const exportParam = searchParams.get('export');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        await dbConnect();

        const query: any = { isDeleted: { $ne: true } };

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { _id: { $regex: search, $options: 'i' } },
                { userEmail: { $regex: search, $options: 'i' } },
            ];
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        if (exportParam === 'csv') {
            const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
            const headers = 'Order ID,User Email,Total Amount,Status,Payment Status,Created At\n';
            const rows = orders.map((o: any) => {
                const items = o.items.map((i: any) => i.title).join('; ');
                return `${o._id},${o.userEmail},${o.totalAmount},${o.status},${o.paymentStatus || 'PENDING'},${new Date(o.createdAt).toISOString()},${items}`;
            }).join('\n');
            const csv = headers + rows;
            return new NextResponse(csv, {
                status: 200,
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename=orders.csv',
                },
            });
        }

        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Order.countDocuments(query),
        ]);

        const data = await getCached(
            `${CACHE_KEY}:${status || 'all'}:${page}:${limit}`,
            () => ({ orders, total }),
            ORDERS_TTL
        );

        return NextResponse.json({ orders: data.orders, total: data.total, page, limit }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await requireAuth();
        if (!auth.authorized) return auth.response;

        const body = await request.json();
        await dbConnect();

        const newOrder = await Order.create(body);
        return NextResponse.json(newOrder, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        const body = await request.json();
        const contentType = request.headers.get('content-type');

        await dbConnect();

        if (contentType?.includes('application/json') && body.orderIds) {
            const parsed = bulkUpdateOrderSchema.safeParse(body);
            if (!parsed.success) {
                return NextResponse.json(
                    { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
                    { status: 400 }
                );
            }

            const { orderIds, status, paymentStatus } = parsed.data;
            const updateData: any = {};
            if (status) updateData.status = status;
            if (paymentStatus) updateData.paymentStatus = paymentStatus;

            const historyEntry = {
                status: status || paymentStatus || 'updated',
                changedAt: new Date(),
                changedBy: auth.user.email,
            };

            const result = await Order.updateMany(
                { _id: { $in: orderIds } },
                {
                    $set: updateData,
                    $push: { history: historyEntry },
                }
            );

            await invalidateCache(CACHE_KEY);

            return NextResponse.json({ modified: result.modifiedCount }, { status: 200 });
        }

        const { id } = body;
        if (!id) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const { status, paymentStatus } = body;
        const updateData: any = {};
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        if (status || paymentStatus) {
            const historyEntry = {
                status: status || paymentStatus || 'updated',
                changedAt: new Date(),
                changedBy: auth.user.email,
            };
            updateData.history = [...(order.history || []), historyEntry];
        }

        const updatedOrder = await Order.findByIdAndUpdate(id, { $set: updateData }, { new: true });

        await invalidateCache(CACHE_KEY);

        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        await dbConnect();

        await Order.findByIdAndUpdate(id, { $set: { isDeleted: true } });

        await invalidateCache(CACHE_KEY);

        return NextResponse.json({ message: 'Order soft-deleted successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}