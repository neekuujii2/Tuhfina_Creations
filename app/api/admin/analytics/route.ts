import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { getCached, invalidateCache } from '@/lib/cache/redis';

const CACHE_KEY = 'admin:analytics';
const ANALYTICS_TTL = 300;

export async function GET(request: Request) {
    try {
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || 'daily';

        await dbConnect();

        const analytics = await getCached(
            `${CACHE_KEY}:${period}`,
            async () => {
                const now = new Date();
                let startDate: Date;
                let groupBy: 'day' | 'week' | 'month';

                switch (period) {
                    case 'weekly':
                        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        groupBy = 'week';
                        break;
                    case 'monthly':
                        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                        groupBy = 'month';
                        break;
                    default:
                        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        groupBy = 'day';
                }

                const orders = await Order.find({
                    createdAt: { $gte: startDate },
                    isDeleted: { $ne: true },
                }).lean();

                const revenueByPeriod = new Map<string, number>();
                const ordersByStatus = new Map<string, number>();
                const productSales = new Map<string, { title: string; quantity: number; revenue: number }>();

                let totalRevenue = 0;
                let totalOrders = orders.length;

                orders.forEach((order: any) => {
                    const date = new Date(order.createdAt);
                    let periodKey: string;

                    if (groupBy === 'day') {
                        periodKey = date.toISOString().split('T')[0];
                    } else if (groupBy === 'week') {
                        const weekStart = new Date(date);
                        weekStart.setDate(date.getDate() - date.getDay());
                        periodKey = weekStart.toISOString().split('T')[0];
                    } else {
                        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    }

                    revenueByPeriod.set(periodKey, (revenueByPeriod.get(periodKey) || 0) + (order.paymentStatus === 'PAID' ? order.totalAmount : 0));
                    ordersByStatus.set(order.status, (ordersByStatus.get(order.status) || 0) + 1);

                    if (order.paymentStatus === 'PAID') {
                        totalRevenue += order.totalAmount;
                    }

                    order.items.forEach((item: any) => {
                        const existing = productSales.get(item.productId) || { title: item.title, quantity: 0, revenue: 0 };
                        existing.quantity += item.quantity;
                        existing.revenue += item.price * item.quantity;
                        productSales.set(item.productId, existing);
                    });
                });

                const sortedRevenue = Array.from(revenueByPeriod.entries())
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, revenue]) => ({ date, revenue }));

                const statusData = Array.from(ordersByStatus.entries()).map(([status, count]) => ({
                    status,
                    count,
                }));

                const topProducts = Array.from(productSales.entries())
                    .sort((a, b) => b[1].revenue - a[1].revenue)
                    .slice(0, 5)
                    .map(([id, data]) => ({ id, ...data }));

                const previousPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
                const previousOrders = await Order.find({
                    createdAt: { $gte: previousPeriodStart, $lt: startDate },
                    isDeleted: { $ne: true },
                }).lean();

                const previousRevenue = previousOrders.reduce((sum: number, o: any) => sum + (o.paymentStatus === 'PAID' ? o.totalAmount : 0), 0);
                const previousTotalOrders = previousOrders.length;

                const revenueChange = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
                const ordersChange = previousTotalOrders > 0 ? ((totalOrders - previousTotalOrders) / previousTotalOrders) * 100 : 0;

                return {
                    revenue: sortedRevenue,
                    ordersByStatus: statusData,
                    topProducts,
                    totalRevenue,
                    totalOrders,
                    revenueChange,
                    ordersChange,
                    period,
                };
            },
            ANALYTICS_TTL
        );

        return NextResponse.json(analytics, { status: 200 });
    } catch (error: any) {
        console.error('GET ANALYTICS ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}