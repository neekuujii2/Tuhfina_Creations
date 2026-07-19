import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import StoreSettings from '@/models/StoreSettings';
import { requireRole } from '@/lib/auth/requireRole';

export async function GET(request: Request) {
    try {
        const auth = await requireRole(['owner', 'manager']);
        if (!auth.authorized) return auth.response;

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'sales';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const format = searchParams.get('format') || 'csv';

        await dbConnect();

        if (type === 'sales' || type === 'gst') {
            const query: any = { isDeleted: { $ne: true } };
            if (startDate) query.createdAt = { ...query.createdAt, $gte: new Date(startDate) };
            if (endDate) query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };

            const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

            if (format === 'csv') {
                const settings = await StoreSettings.findOne({}).lean();
                const headers = type === 'gst'
                    ? 'Order ID,Date,Customer Email,Total Amount,GSTIN,Legal Name\n'
                    : 'Order ID,Date,Customer Email,Total Amount,Status,Payment Status\n';
                const rows = orders.map((o: any) => {
                    if (type === 'gst') {
                        return `${o._id},${new Date(o.createdAt).toISOString().split('T')[0]},${o.userEmail},${o.totalAmount},${(settings as any)?.gstin || ''},${(settings as any)?.legalName || ''}`;
                    }
                    return `${o._id},${new Date(o.createdAt).toISOString().split('T')[0]},${o.userEmail},${o.totalAmount},${o.status},${o.paymentStatus || 'PENDING'}`;
                }).join('\n');
                return new NextResponse(headers + rows, {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/csv',
                        'Content-Disposition': `attachment; filename=${type}-report.csv`,
                    },
                });
            }
        }

        if (type === 'inventory') {
            const products = await Product.find({}).sort({ category: 1 }).lean();

            if (format === 'csv') {
                const headers = 'Product ID,Title,Category,Price,Stock,Status\n';
                const rows = products.map((p: any) => `${p._id},${p.title},${p.category},${p.price},${p.stock || 0},${p.status || 'published'}`).join('\n');
                return new NextResponse(headers + rows, {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/csv',
                        'Content-Disposition': 'attachment; filename=inventory-report.csv',
                    },
                });
            }
        }

        if (type === 'customers') {
            const orders = await Order.find({ isDeleted: { $ne: true } }).lean();
            const customerMap = new Map();

            orders.forEach((order: any) => {
                const email = order.userEmail;
                if (!customerMap.has(email)) {
                    customerMap.set(email, {
                        email,
                        name: order.shippingAddress?.name || email,
                        phone: order.shippingAddress?.phone || '',
                        totalOrders: 0,
                        totalSpent: 0,
                    });
                }
                const customer = customerMap.get(email)!;
                customer.totalOrders += 1;
                customer.totalSpent += order.paymentStatus === 'PAID' ? order.totalAmount : 0;
            });

            const customers = Array.from(customerMap.values());

            if (format === 'csv') {
                const headers = 'Email,Name,Phone,Total Orders,Total Spent\n';
                const rows = customers.map((c: any) => `${c.email},${c.name},${c.phone},${c.totalOrders},${c.totalSpent}`).join('\n');
                return new NextResponse(headers + rows, {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/csv',
                        'Content-Disposition': 'attachment; filename=customers-report.csv',
                    },
                });
            }

            return NextResponse.json(customers, { status: 200 });
        }

        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    } catch (error: any) {
        console.error('GET REPORTS ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
