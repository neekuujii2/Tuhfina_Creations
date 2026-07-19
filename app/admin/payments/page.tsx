'use client';

export const dynamic = 'force-dynamic';

import useSWR from 'swr';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Order } from '@/lib/types';
import { Download, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PaymentsPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const { toast } = useToast();

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const queryParams = new URLSearchParams();
    if (startDate) queryParams.set('startDate', startDate);
    if (endDate) queryParams.set('endDate', endDate);
    const queryString = queryParams.toString();

    const { data: orders, error, isLoading } = useSWR<Order[]>(`/api/payments?${queryString}`, fetcher);

    const handleExport = () => {
        window.open(`/api/reports?type=sales${queryString ? '&' + queryString : ''}&format=csv`, '_blank');
    };

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" /></div>;
    }

    if (!user || !isAdmin) return null;

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" /></div>;
    }

    const paidOrders = orders?.filter(o => o.paymentStatus === 'PAID') || [];
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-primary">Payment Ledger</h2>
                    <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">{paidOrders.length} paid orders</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-text-secondary" />
                        <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); }} className="input-luxury text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-text-secondary">to</span>
                        <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); }} className="input-luxury text-sm" />
                    </div>
                    <Button variant="outline-luxury" size="sm" onClick={handleExport} className="flex items-center gap-1">
                        <Download size={14} /> Export CSV
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-border rounded-[24px] p-6 shadow-soft">
                    <p className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white border border-border rounded-[24px] p-6 shadow-soft">
                    <p className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Paid Orders</p>
                    <p className="text-3xl font-bold text-primary">{paidOrders.length}</p>
                </div>
                <div className="bg-white border border-border rounded-[24px] p-6 shadow-soft">
                    <p className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Average Order Value</p>
                    <p className="text-3xl font-bold text-primary">₹{paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length).toLocaleString() : 0}</p>
                </div>
            </div>

            <div className="bg-white border border-border rounded-[28px] shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-surface text-text-secondary uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 font-bold">Order ID</th>
                                <th className="px-4 py-3 font-bold">Date</th>
                                <th className="px-4 py-3 font-bold">Customer</th>
                                <th className="px-4 py-3 font-bold">Amount</th>
                                <th className="px-4 py-3 font-bold">Payment ID</th>
                                <th className="px-4 py-3 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {paidOrders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-surface/50 transition">
                                    <td className="px-4 py-3 font-mono">{order.id?.slice(-8)}</td>
                                    <td className="px-4 py-3 text-text-secondary">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">{order.userEmail}</td>
                                    <td className="px-4 py-3 font-bold text-green-600">₹{order.totalAmount}</td>
                                    <td className="px-4 py-3 font-mono">{order.razorpayPaymentId || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-600">
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {paidOrders.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-12 text-center text-text-secondary">No paid orders found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
