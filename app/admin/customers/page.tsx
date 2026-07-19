'use client';

export const dynamic = 'force-dynamic';

import useSWR, { useSWRConfig } from 'swr';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Order } from '@/lib/types';
import { Search, User, Mail, Phone, ShoppingBag, ChevronRight } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CustomersPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const { mutate } = useSWRConfig();

    const [search, setSearch] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

    const queryUrl = search ? `/api/admin/customers?search=${encodeURIComponent(search)}` : '/api/admin/customers';

    const { data: customers = [], error: customersError, isLoading: customersLoading } = useSWR<any[]>(queryUrl, fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 5000,
    });

    const { data: customerDetail, error: detailError, isLoading: detailLoading } = useSWR<any>(
        selectedCustomer ? `/api/admin/customers?orderId=${selectedCustomer.orderId}` : null,
        fetcher
    );

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" />
            </div>
        );
    }

    if (!user || !isAdmin) {
        return null;
    }

    if (customersLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" />
            </div>
        );
    }

    if (customersError) {
        return (
            <div className="text-center py-16">
                <p className="text-red-600 font-semibold">Failed to load customers</p>
                <button onClick={() => mutate(queryUrl)} className="mt-4 btn-outline-luxury">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-serif font-bold text-primary">Customers</h2>
                <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
                    {customers.length} registered customers
                </p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-luxury pl-9 text-sm w-full lg:w-96"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {customers.map((customer: any) => (
                        <div
                            key={customer.email}
                            className={`bg-white border rounded-2xl p-5 shadow-soft cursor-pointer transition ${selectedCustomer?.email === customer.email ? 'border-accent ring-1 ring-accent' : 'border-border'}`}
                            onClick={() => setSelectedCustomer({ email: customer.email, orderId: customer.orders?.[0]?._id })}
                        >
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                                    <User size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-serif font-bold text-base text-primary truncate">{customer.name || customer.email}</h3>
                                    <div className="flex items-center gap-1 text-xs text-text-secondary mt-1">
                                        <Mail size={12} />
                                        <span className="truncate">{customer.email}</span>
                                    </div>
                                    {customer.phone && (
                                        <div className="flex items-center gap-1 text-xs text-text-secondary mt-1">
                                            <Phone size={12} />
                                            <span>{customer.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 mt-3">
                                        <span className="text-xs font-bold text-primary">
                                            {customer.totalOrders} orders
                                        </span>
                                        <span className="text-xs font-bold text-green-600">
                                            ₹{customer.totalSpent?.toLocaleString?.() || customer.totalSpent}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-text-secondary flex-shrink-0" />
                            </div>
                        </div>
                    ))}
                    {customers.length === 0 && (
                        <div className="text-center py-16 bg-surface border border-dashed border-border rounded-2xl">
                            <p className="text-text-secondary font-serif">No customers found.</p>
                        </div>
                    )}
                </div>

                <div>
                    {selectedCustomer && (
                        <div className="bg-white border border-border rounded-2xl p-6 shadow-soft">
                            <h3 className="text-lg font-serif font-bold text-primary mb-4">Order History</h3>
                            {detailLoading && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent border-t-transparent" />
                                </div>
                            )}
                            {detailError && (
                                <p className="text-red-600 text-sm">Failed to load order history</p>
                            )}
                            {customerDetail && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 pb-4 border-b border-border">
                                        <div className="h-10 w-10 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-primary text-sm">{customerDetail.customer?.name || customerDetail.customer?.email}</p>
                                            <p className="text-xs text-text-secondary">{customerDetail.customer?.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-surface rounded-xl p-4">
                                            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Total Orders</p>
                                            <p className="text-xl font-bold text-primary">{customerDetail.totalOrders}</p>
                                        </div>
                                        <div className="bg-surface rounded-xl p-4">
                                            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Total Spent</p>
                                            <p className="text-xl font-bold text-green-600">₹{customerDetail.totalSpent?.toLocaleString?.() || customerDetail.totalSpent}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {customerDetail.orders?.map((order: Order) => (
                                            <div key={order.id} className="bg-surface border border-border rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-mono text-xs font-bold text-primary">{order.id}</span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                        {order.paymentStatus || 'PENDING'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-text-secondary">
                                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                                    <span className="font-bold text-primary">₹{order.totalAmount}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {!selectedCustomer && (
                        <div className="bg-surface border border-dashed border-border rounded-2xl p-8 text-center">
                            <ShoppingBag className="mx-auto mb-4 text-text-secondary" size={48} />
                            <p className="text-text-secondary font-serif">Select a customer to view their order history.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}