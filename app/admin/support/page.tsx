'use client';

export const dynamic = 'force-dynamic';

import useSWR, { useSWRConfig } from 'swr';
import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { HelpCircle, Plus, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SupportPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const { mutate } = useSWRConfig();

    const { data: tickets = [], error, isLoading } = useSWR<any[]>('/api/support', fetcher);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', category: 'Question' as 'Bug' | 'Feature Request' | 'Question' });
    const [uploading, setUploading] = useState(false);
    const [screenshotUrl, setScreenshotUrl] = useState('');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteTicketId, setDeleteTicketId] = useState<string | null>(null);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, screenshotUrl }),
            });
            if (res.ok) {
                toast('Support ticket created', 'success');
                setShowCreateModal(false);
                setFormData({ title: '', description: '', category: 'Question' });
                setScreenshotUrl('');
                mutate('/api/support');
            } else {
                throw new Error('Failed to create');
            }
        } catch (error) {
            toast('Failed to create ticket', 'error');
        }
    };

    const handleStatusUpdate = async (ticketId: string, status: string) => {
        try {
            const res = await fetch('/api/support', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId, status }),
            });
            if (res.ok) {
                toast('Ticket updated', 'success');
                mutate('/api/support');
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            toast('Failed to update ticket', 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteTicketId) return;
        try {
            const res = await fetch(`/api/support?id=${deleteTicketId}`, { method: 'DELETE' });
            if (res.ok) {
                toast('Ticket deleted', 'success');
                mutate('/api/support');
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            toast('Failed to delete ticket', 'error');
        } finally {
            setDeleteTicketId(null);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            if (res.ok) {
                const data = await res.json();
                setScreenshotUrl(data.urls[0]);
                toast('Image uploaded', 'success');
            }
        } catch (error) {
            toast('Failed to upload image', 'error');
        } finally {
            setUploading(false);
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
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-primary">Help & Support</h2>
                    <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">{tickets.length} tickets</p>
                </div>
                <Button variant="luxury" className="flex items-center gap-1.5" onClick={() => setShowCreateModal(true)}>
                    <Plus size={16} /> New Ticket
                </Button>
            </div>

            <div className="bg-white border border-border rounded-[28px] shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-surface text-text-secondary uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 font-bold">Title</th>
                                <th className="px-4 py-3 font-bold">Category</th>
                                <th className="px-4 py-3 font-bold">Status</th>
                                <th className="px-4 py-3 font-bold">Raised By</th>
                                <th className="px-4 py-3 font-bold">Date</th>
                                <th className="px-4 py-3 font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {tickets.map((ticket: any) => (
                                <tr key={ticket._id} className="hover:bg-surface/50 transition">
                                    <td className="px-4 py-3 font-semibold text-primary">{ticket.title}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ticket.category === 'Bug' ? 'bg-red-100 text-red-600' : ticket.category === 'Feature Request' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                            {ticket.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${ticket.status === 'resolved' ? 'bg-green-100 text-green-600' : ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {ticket.status === 'resolved' && <CheckCircle size={10} />}
                                            {ticket.status === 'in-progress' && <Clock size={10} />}
                                            {ticket.status === 'open' && <HelpCircle size={10} />}
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{ticket.raisedBy}</td>
                                    <td className="px-4 py-3 text-text-secondary">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {ticket.status === 'open' && (
                                                <Button variant="ghost" size="sm" onClick={() => handleStatusUpdate(ticket._id, 'in-progress')}>Start</Button>
                                            )}
                                            {ticket.status === 'in-progress' && (
                                                <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleStatusUpdate(ticket._id, 'resolved')}>Resolve</Button>
                                            )}
                                            <Button variant="ghost" size="sm" className="text-red-600" onClick={() => { setDeleteTicketId(ticket._id); setDeleteConfirmOpen(true); }}>
                                                <XCircle size={14} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {tickets.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-12 text-center text-text-secondary">No support tickets yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogHeader onClose={() => setShowCreateModal(false)}>
                    <DialogTitle>Create Support Ticket</DialogTitle>
                    <DialogDescription>Report a bug, request a feature, or ask a question.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Title *</label>
                        <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="input-luxury" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Category *</label>
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as any })} className="input-luxury">
                            <option value="Question">Question</option>
                            <option value="Bug">Bug</option>
                            <option value="Feature Request">Feature Request</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Description *</label>
                        <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="input-luxury rounded-2xl" rows={4} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Screenshot (optional)</label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <div className="btn-outline-luxury flex items-center gap-2 text-xs font-semibold py-2 px-4 rounded-full">
                                <Upload size={14} />
                                {uploading ? 'Uploading...' : 'Upload Image'}
                            </div>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                        </label>
                        {screenshotUrl && <img src={screenshotUrl} alt="Screenshot" className="mt-2 h-20 rounded-lg border border-border" />}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline-luxury" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                        <Button type="submit" variant="luxury">Create Ticket</Button>
                    </DialogFooter>
                </form>
            </Dialog>

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Delete Ticket"
                description="Are you sure? This cannot be undone."
                confirmLabel="Delete"
                onConfirm={handleDelete}
            />
        </div>
    );
}
