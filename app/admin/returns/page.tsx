'use client';

export const dynamic = 'force-dynamic';

import useSWR, { useSWRConfig } from 'swr';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Package, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ReturnsPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const { mutate } = useSWRConfig();

    const { data: returns = [], error, isLoading } = useSWR<any[]>('/api/returns', fetcher);
    const [selectedReturn, setSelectedReturn] = useState<any>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [refundAmount, setRefundAmount] = useState('');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteReturnId, setDeleteReturnId] = useState<string | null>(null);

    const handleStatusUpdate = async (returnId: string, status: string) => {
        try {
            const res = await fetch('/api/returns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ returnId, status, refundAmount: status === 'refunded' ? Number(refundAmount) : undefined }),
            });
            if (res.ok) {
                toast(`Return ${status}`, 'success');
                mutate('/api/returns');
                setShowDetailsModal(false);
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            toast('Failed to update return', 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteReturnId) return;
        try {
            const res = await fetch(`/api/returns?id=${deleteReturnId}`, { method: 'DELETE' });
            if (res.ok) {
                toast('Return deleted', 'success');
                mutate('/api/returns');
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            toast('Failed to delete return', 'error');
        } finally {
            setDeleteReturnId(null);
        }
    };

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" /></div>;
    }

    if (!user || !isAdmin) return null;

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-serif font-bold text-primary">Returns & Refunds</h2>
                <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">{returns.length} return requests</p>
            </div>

            <div className="bg-white border border-border rounded-[28px] shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-surface text-text-secondary uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 font-bold">Order ID</th>
                                <th className="px-4 py-3 font-bold">Product ID</th>
                                <th className="px-4 py-3 font-bold">Reason</th>
                                <th className="px-4 py-3 font-bold">Status</th>
                                <th className="px-4 py-3 font-bold">Requested</th>
                                <th className="px-4 py-3 font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {returns.map((r: any) => (
                                <tr key={r._id} className="hover:bg-surface/50 transition">
                                    <td className="px-4 py-3 font-mono">{r.orderId?.slice(-8)}</td>
                                    <td className="px-4 py-3 font-mono">{r.productId?.slice(-8)}</td>
                                    <td className="px-4 py-3 max-w-[200px] truncate">{r.reason}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'approved' ? 'bg-green-100 text-green-600' : r.status === 'rejected' ? 'bg-red-100 text-red-600' : r.status === 'refunded' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                            {r.status === 'approved' && <CheckCircle size={10} />}
                                            {r.status === 'rejected' && <XCircle size={10} />}
                                            {r.status === 'refunded' && <RotateCcw size={10} />}
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-text-secondary">{new Date(r.requestedAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => { setSelectedReturn(r); setShowDetailsModal(true); }}>View</Button>
                                            {r.status === 'requested' && (
                                                <>
                                                    <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleStatusUpdate(r._id, 'approved')}>Approve</Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleStatusUpdate(r._id, 'rejected')}>Reject</Button>
                                                </>
                                            )}
                                            {r.status === 'approved' && (
                                                <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => handleStatusUpdate(r._id, 'refunded')}>Mark Refunded</Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {returns.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-12 text-center text-text-secondary">No return requests yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                <DialogHeader onClose={() => setShowDetailsModal(false)}>
                    <DialogTitle>Return Request Details</DialogTitle>
                    <DialogDescription>Order: {selectedReturn?.orderId?.slice(-8)}</DialogDescription>
                </DialogHeader>
                {selectedReturn && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Reason</p>
                            <p className="text-sm text-primary">{selectedReturn.reason}</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Current Status</p>
                            <p className="text-sm text-primary capitalize">{selectedReturn.status}</p>
                        </div>
                        {selectedReturn.status === 'approved' && (
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Refund Amount (₹)</label>
                                <input type="number" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} className="input-luxury" />
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline-luxury" onClick={() => setShowDetailsModal(false)}>Close</Button>
                            {selectedReturn.status === 'approved' && (
                                <Button variant="luxury" onClick={() => handleStatusUpdate(selectedReturn._id, 'refunded')}>Mark Refunded</Button>
                            )}
                        </DialogFooter>
                    </div>
                )}
            </Dialog>

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Delete Return Request"
                description="Are you sure? This cannot be undone."
                confirmLabel="Delete"
                onConfirm={handleDelete}
            />
        </div>
    );
}
