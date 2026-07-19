'use client';

export const dynamic = 'force-dynamic';

import useSWR, { useSWRConfig } from 'swr';
import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Search, Filter, ChevronLeft, ChevronRight, FileText, User, Tag, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AuditLogPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const { mutate } = useSWRConfig();

    const [adminEmail, setAdminEmail] = useState('');
    const [action, setAction] = useState('');
    const [entityType, setEntityType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);

    const buildQuery = () => {
        const params = new URLSearchParams();
        if (adminEmail) params.set('adminEmail', adminEmail);
        if (action) params.set('action', action);
        if (entityType) params.set('entityType', entityType);
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);
        params.set('page', String(page));
        params.set('limit', '20');
        return `/api/admin/audit-log?${params.toString()}`;
    };

    const { data, error, isLoading } = useSWR<{ logs: any[]; total: number; page: number; limit: number }>(buildQuery(), fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 5000,
    });

    const logs = data?.logs || [];
    const total = data?.total || 0;
    const totalPages = Math.ceil(total / 20);

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16">
                <p className="text-red-600 font-semibold">Failed to load audit log</p>
                <button onClick={() => mutate(buildQuery())} className="mt-4 btn-outline-luxury">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-serif font-bold text-primary">Audit Log</h2>
                <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
                    {total} total entries
                </p>
            </div>

            <div className="bg-white border border-border rounded-2xl p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                        <input
                            type="text"
                            placeholder="Admin email..."
                            value={adminEmail}
                            onChange={(e) => { setAdminEmail(e.target.value); setPage(1); }}
                            className="input-luxury pl-9 text-sm w-full"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Action (e.g. product.create)..."
                        value={action}
                        onChange={(e) => { setAction(e.target.value); setPage(1); }}
                        className="input-luxury text-sm w-full"
                    />
                    <select
                        value={entityType}
                        onChange={(e) => { setEntityType(e.target.value); setPage(1); }}
                        className="input-luxury text-sm w-full"
                    >
                        <option value="">All Entities</option>
                        <option value="Product">Product</option>
                        <option value="Order">Order</option>
                        <option value="Category">Category</option>
                        <option value="FestivalConfig">Festival Config</option>
                        <option value="CategoryOffer">Category Offer</option>
                    </select>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                        className="input-luxury text-sm w-full"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                        className="input-luxury text-sm w-full"
                    />
                </div>
            </div>

            <div className="bg-white border border-border rounded-2xl shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-surface text-text-secondary uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 font-bold">Timestamp</th>
                                <th className="px-4 py-3 font-bold">Admin</th>
                                <th className="px-4 py-3 font-bold">Action</th>
                                <th className="px-4 py-3 font-bold">Entity</th>
                                <th className="px-4 py-3 font-bold">Entity ID</th>
                                <th className="px-4 py-3 font-bold">Before</th>
                                <th className="px-4 py-3 font-bold">After</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {logs.map((log: any) => (
                                <tr key={log._id} className="hover:bg-surface/50 transition">
                                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-primary">{log.adminEmail}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent font-bold">
                                            <Tag size={10} />
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-semibold">{log.entityType}</td>
                                    <td className="px-4 py-3 font-mono text-text-secondary">{log.entityId?.slice(-6) || '-'}</td>
                                    <td className="px-4 py-3 text-text-secondary max-w-[200px] truncate">
                                        {log.before ? JSON.stringify(log.before).slice(0, 60) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-text-secondary max-w-[200px] truncate">
                                        {log.after ? JSON.stringify(log.after).slice(0, 60) : '-'}
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-text-secondary">
                                        <FileText className="mx-auto mb-3 opacity-20" size={48} />
                                        <p className="font-serif">No audit log entries found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                        <Button
                            variant="outline-luxury"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1"
                        >
                            <ChevronLeft size={14} />
                            Previous
                        </Button>
                        <span className="text-xs text-text-secondary font-semibold">
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            variant="outline-luxury"
                            size="sm"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="flex items-center gap-1"
                        >
                            Next
                            <ChevronRight size={14} />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
