'use client';

export const dynamic = 'force-dynamic';

import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Product, Order } from '@/lib/types';
import {
    Package,
    ShoppingBag,
    AlertCircle,
    DollarSign,
    TrendingUp,
    TrendingDown,
    LayoutDashboard,
    User,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend,
} from 'recharts';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const COLORS = ['#d4af37', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export default function AdminDashboard() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

    const { data: products = [] } = useSWR<Product[]>('/api/products', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 5000,
    });
    const { data: orders = [] } = useSWR<Order[]>('/api/orders', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 5000,
    });
    const { data: analytics } = useSWR(`/api/admin/analytics?period=${period}`, fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 5000,
    });

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" />
            </div>
        );
    }

    if (!user || !isAdmin) {
        router.push('/login');
        return null;
    }

    const totalRevenue = orders.reduce((sum, o) => o.paymentStatus === 'PAID' ? sum + o.totalAmount : sum, 0);
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const totalOrders = orders.length;

    const revenueChange = analytics?.revenueChange ?? 0;
    const ordersChange = analytics?.ordersChange ?? 0;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-primary mb-1">Dashboard Overview</h2>
                    <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
                        Real-time analytics for your store
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-border rounded-full p-1">
                    {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                                period === p ? 'bg-accent text-white' : 'text-text-secondary hover:text-primary'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Products"
                    value={String(products.length)}
                    icon={<Package size={20} />}
                    change={null}
                />
                <StatCard
                    title="Total Orders"
                    value={String(totalOrders)}
                    icon={<ShoppingBag size={20} />}
                    change={ordersChange}
                />
                <StatCard
                    title="Pending Orders"
                    value={String(pendingOrders)}
                    icon={<AlertCircle size={20} />}
                    change={null}
                />
                <StatCard
                    title="Paid Revenue"
                    value={`₹${totalRevenue.toLocaleString()}`}
                    icon={<DollarSign size={20} />}
                    change={revenueChange}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-border rounded-[28px] p-6 shadow-soft">
                    <h3 className="text-lg font-serif font-bold text-primary mb-4">Revenue Trend</h3>
                    {analytics?.revenue?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.revenue}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                                    formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={2} dot={{ fill: '#d4af37', r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-text-secondary">No data available</div>
                    )}
                </div>

                <div className="bg-white border border-border rounded-[28px] p-6 shadow-soft">
                    <h3 className="text-lg font-serif font-bold text-primary mb-4">Orders by Status</h3>
                    {analytics?.ordersByStatus?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.ordersByStatus}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ status, percent }) => `${status} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="status"
                                >
                                    {analytics.ordersByStatus.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-text-secondary">No data available</div>
                    )}
                </div>
            </div>

            <div className="bg-white border border-border rounded-[28px] p-6 shadow-soft">
                <h3 className="text-lg font-serif font-bold text-primary mb-4">Top 5 Selling Products</h3>
                {analytics?.topProducts?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.topProducts}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="title" tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                                formatter={(value: any, name: string) => {
                                    if (name === 'revenue') return [`₹${Number(value).toLocaleString()}`, 'Revenue'];
                                    return [value, name];
                                }}
                            />
                            <Legend />
                            <Bar dataKey="revenue" fill="#d4af37" radius={[8, 8, 0, 0]} name="Revenue" />
                            <Bar dataKey="quantity" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Quantity" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-text-secondary">No data available</div>
                )}
            </div>

            <div className="bg-white border border-border rounded-[28px] p-8 shadow-soft">
                <h3 className="text-lg font-serif font-bold text-primary mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <a href="/admin/products" className="flex items-center gap-3 p-4 rounded-2xl border border-border hover:border-accent transition group">
                        <div className="h-10 w-10 rounded-full bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition"><Package size={18} /></div>
                        <div>
                            <p className="text-sm font-bold text-primary">Products</p>
                            <p className="text-[10px] text-text-secondary uppercase tracking-wider">Manage catalog</p>
                        </div>
                    </a>
                    <a href="/admin/orders" className="flex items-center gap-3 p-4 rounded-2xl border border-border hover:border-accent transition group">
                        <div className="h-10 w-10 rounded-full bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center group-hover:bg-[#d4af37] group-hover:text-white transition"><ShoppingBag size={18} /></div>
                        <div>
                            <p className="text-sm font-bold text-primary">Orders</p>
                            <p className="text-[10px] text-text-secondary uppercase tracking-wider">View orders</p>
                        </div>
                    </a>
                    <a href="/admin/categories" className="flex items-center gap-3 p-4 rounded-2xl border border-border hover:border-accent transition group">
                        <div className="h-10 w-10 rounded-full bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition"><LayoutDashboard size={18} /></div>
                        <div>
                            <p className="text-sm font-bold text-primary">Categories</p>
                            <p className="text-[10px] text-text-secondary uppercase tracking-wider">Manage media</p>
                        </div>
                    </a>
                    <a href="/admin/customers" className="flex items-center gap-3 p-4 rounded-2xl border border-border hover:border-accent transition group">
                        <div className="h-10 w-10 rounded-full bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition"><User size={18} /></div>
                        <div>
                            <p className="text-sm font-bold text-primary">Customers</p>
                            <p className="text-[10px] text-text-secondary uppercase tracking-wider">View customers</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, change }: { title: string; value: string; icon: React.ReactNode; change: number | null }) {
    return (
        <div className="bg-white border border-border rounded-[24px] p-6 shadow-soft relative overflow-hidden">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                    <p className="text-2xl font-bold text-primary">{value}</p>
                    {change !== null && (
                        <div className={`flex items-center gap-1 mt-1 text-xs font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {Math.abs(change).toFixed(1)}% vs prev
                        </div>
                    )}
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center">{icon}</div>
            </div>
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-accent/20" />
        </div>
    );
}