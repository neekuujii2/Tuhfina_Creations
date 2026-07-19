import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { getCached, invalidateCache } from '@/lib/cache/redis';

const CACHE_KEY = 'admin:customers';
const CUSTOMERS_TTL = 120;

export async function GET(request: Request) {
    try {
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const orderId = searchParams.get('orderId');

        await dbConnect();

        if (orderId) {
            const order = await Order.findById(orderId).lean();
            if (!order) {
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }

            const customerOrders = await Order.find({ userEmail: order.userEmail, isDeleted: { $ne: true } })
                .sort({ createdAt: -1 })
                .lean();

            const totalSpent = customerOrders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.totalAmount : 0), 0);

            return NextResponse.json({
                customer: {
                    email: order.userEmail,
                    name: order.shippingAddress?.name || order.userEmail,
                    phone: order.shippingAddress?.phone,
                },
                orders: customerOrders,
                totalOrders: customerOrders.length,
                totalSpent,
            }, { status: 200 });
        }

        const customers = await getCached(
            CACHE_KEY,
            async () => {
                const orders = await Order.find({ isDeleted: { $ne: true } }).lean();
                const customerMap = new Map<string, any>();

                orders.forEach((order: any) => {
                    const email = order.userEmail;
                    if (!customerMap.has(email)) {
                        customerMap.set(email, {
                            email,
                            name: order.shippingAddress?.name || email,
                            phone: order.shippingAddress?.phone,
                            totalOrders: 0,
                            totalSpent: 0,
                            lastOrderAt: order.createdAt,
                        });
                    }
                    const customer = customerMap.get(email)!;
                    customer.totalOrders += 1;
                    customer.totalSpent += order.paymentStatus === 'PAID' ? order.totalAmount : 0;
                    if (new Date(order.createdAt) > new Date(customer.lastOrderAt)) {
                        customer.lastOrderAt = order.createdAt;
                    }
                });

                return Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
            },
            CUSTOMERS_TTL
        );

        if (search) {
            const filtered = customers.filter((c: any) =>
                c.email.toLowerCase().includes(search.toLowerCase()) ||
                c.name.toLowerCase().includes(search.toLowerCase())
            );
            return NextResponse.json(filtered, { status: 200 });
        }

        return NextResponse.json(customers, { status: 200 });
    } catch (error: any) {
        console.error('GET CUSTOMERS ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}