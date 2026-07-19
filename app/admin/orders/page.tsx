'use client';

export const dynamic = 'force-dynamic';

import useSWR, { useSWRConfig } from 'swr';
import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { orderService } from '@/lib/services/orderService';
import { Order } from '@/lib/types';
import { Package, Search, Filter, Download, ChevronDown, ChevronUp, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderRow } from '@/components/admin/OrderRow';
import { OrderRowSkeleton, StatCardSkeleton } from '@/components/admin/skeletons/AdminSkeletons';
import { EmptyState } from '@/components/admin/EmptyState';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function OrdersPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const { mutate } = useSWRConfig();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkStatus, setBulkStatus] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const buildQuery = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (statusFilter !== 'all') params.set('status', statusFilter);
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);
        params.set('page', '1');
        params.set('limit', '50');
        return `/api/orders?${params.toString()}`;
    };

    const { data: ordersData, error: ordersError, isLoading: ordersLoading } = useSWR<{ orders: Order[]; total: number }>(buildQuery(), fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 5000,
    });

    const orders = ordersData?.orders || [];
    const total = ordersData?.total || 0;

    const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
        try {
            await orderService.updateOrderStatus(orderId, status);
            toast('Order status updated successfully!', 'success');
            mutate(buildQuery());
        } catch (error) {
            console.error('Error updating order status:', error);
            toast('Failed to update order status', 'error');
        }
    };

    const handleBulkUpdate = async () => {
        if (!bulkStatus || selectedIds.length === 0) return;
        try {
            await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderIds: selectedIds, status: bulkStatus }),
            });
            toast(`Updated ${selectedIds.length} orders`, 'success');
            setSelectedIds([]);
            setBulkStatus('');
            mutate(buildQuery());
        } catch (error) {
            toast('Failed to bulk update orders', 'error');
        }
    };

    const handleExportCSV = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (statusFilter !== 'all') params.set('status', statusFilter);
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);
        params.set('export', 'csv');
        window.open(`/api/orders?${params.toString()}`, '_blank');
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === orders.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(orders.map((o) => o.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

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

    if (ordersLoading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div>
                        <div className="h-8 w-48 bg-luxury-gray/30 rounded-lg animate-pulse mb-2" />
                        <div className="h-3 w-32 bg-luxury-gray/20 rounded-full animate-pulse" />
                    </div>
                    <div className="flex gap-3">
                        <div className="h-10 w-64 bg-luxury-gray/20 rounded-full animate-pulse" />
                        <div className="h-10 w-32 bg-luxury-gray/20 rounded-full animate-pulse" />
                    </div>
                </div>
                <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <OrderRowSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (ordersError) {
        return (
            <div className="text-center py-16">
                <p className="text-red-600 font-semibold">Failed to load orders</p>
                <button onClick={() => mutate(buildQuery())} className="mt-4 btn-outline-luxury">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-primary">Orders Inboxes</h2>
                    <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
                        {total} total orders
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                        <input
                            type="text"
                            placeholder="Search by order ID or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-luxury pl-9 text-sm w-full lg:w-64"
                        />
                    </div>
                    <Button
                        variant="outline-luxury"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-1"
                    >
                        <Filter size={14} />
                        Filters
                        {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </Button>
                    <Button
                        variant="outline-luxury"
                        size="sm"
                        onClick={handleExportCSV}
                        className="flex items-center gap-1"
                    >
                        <Download size={14} />
                        Export CSV
                    </Button>
                </div>
            </div>

            {showFilters && (
                <div className="bg-white border border-border rounded-2xl p-4 flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input-luxury text-sm"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="input-luxury text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="input-luxury text-sm"
                        />
                    </div>
                </div>
            )}

            {selectedIds.length > 0 && (
                <div className="bg-luxury-warm/40 border border-accent/20 rounded-2xl p-4 flex flex-wrap items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {selectedIds.length} selected
                    </span>
                    <select
                        value={bulkStatus}
                        onChange={(e) => setBulkStatus(e.target.value)}
                        className="input-luxury text-sm"
                    >
                        <option value="">Select status...</option>
                        <option value="pending">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <Button
                        variant="luxury"
                        size="sm"
                        onClick={handleBulkUpdate}
                        disabled={!bulkStatus}
                    >
                        Apply Status
                    </Button>
                    <Button
                        variant="outline-luxury"
                        size="sm"
                        onClick={() => setSelectedIds([])}
                    >
                        Clear Selection
                    </Button>
                </div>
            )}

            {orders.length === 0 ? (
                <EmptyState
                    icon="orders"
                    title="No orders yet"
                    description="Orders will appear here once customers start purchasing."
                    secondaryCtaLabel="View Products"
                    onSecondaryCta={() => window.location.href = '/admin/products'}
                />
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="relative">
                            <div className="absolute top-4 left-4 z-10">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(order.id)}
                                    onChange={() => toggleSelect(order.id)}
                                    className="w-4 h-4 accent-accent"
                                />
                            </div>
                            <div className="pl-8">
                                <OrderRow
                                    order={order}
                                    onStatusChange={handleUpdateOrderStatus}
                                />
                            </div>
                            {order.history && order.history.length > 0 && (
                                <div className="mt-2 ml-8">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                        className="flex items-center gap-1 text-xs"
                                    >
                                        <History size={14} />
                                        {expandedOrder === order.id ? 'Hide' : 'Show'} History ({order.history.length})
                                    </Button>
                                    {expandedOrder === order.id && (
                                        <div className="mt-2 bg-surface border border-border rounded-xl p-4 space-y-2">
                                            {order.history.map((entry: any, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between text-xs border-b border-border/40 pb-2 last:border-0">
                                                    <span className="font-semibold text-primary">{entry.status}</span>
                                                    <span className="text-text-secondary">
                                                        {new Date(entry.changedAt).toLocaleString()}
                                                        {entry.changedBy && ` by ${entry.changedBy}`}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}