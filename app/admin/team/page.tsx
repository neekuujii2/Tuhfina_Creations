'use client';

export const dynamic = 'force-dynamic';

import useSWR, { useSWRConfig } from 'swr';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { UserPlus, Shield, Trash2 } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  manager: 'Manager',
  packer: 'Packer',
  viewer: 'Viewer',
};

export default function TeamPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const { mutate } = useSWRConfig();

    const { data: users = [], error, isLoading } = useSWR<any[]>('/api/team', fetcher);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [formData, setFormData] = useState({ email: '', name: '', role: 'viewer' });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                toast('Team member invited successfully', 'success');
                setShowInviteModal(false);
                setFormData({ email: '', name: '', role: 'viewer' });
                mutate('/api/team');
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to invite');
            }
        } catch (error: any) {
            toast(error.message || 'Failed to invite team member', 'error');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        try {
            const res = await fetch('/api/team', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingUser._id, ...formData }),
            });
            if (res.ok) {
                toast('Team member updated', 'success');
                setEditingUser(null);
                setFormData({ email: '', name: '', role: 'viewer' });
                mutate('/api/team');
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            toast('Failed to update team member', 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteUserId) return;
        try {
            const res = await fetch(`/api/team?id=${deleteUserId}`, { method: 'DELETE' });
            if (res.ok) {
                toast('Team member removed', 'success');
                mutate('/api/team');
            } else {
                throw new Error('Failed to remove');
            }
        } catch (error) {
            toast('Failed to remove team member', 'error');
        } finally {
            setDeleteUserId(null);
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
                    <h2 className="text-2xl font-serif font-bold text-primary">Team Management</h2>
                    <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">{users.length} team members</p>
                </div>
                <Button variant="luxury" className="flex items-center gap-1.5" onClick={() => { setEditingUser(null); setFormData({ email: '', name: '', role: 'viewer' }); setShowInviteModal(true); }}>
                    <UserPlus size={16} /> Invite Member
                </Button>
            </div>

            <div className="bg-white border border-border rounded-[28px] shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-surface text-text-secondary uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 font-bold">Name</th>
                                <th className="px-4 py-3 font-bold">Email</th>
                                <th className="px-4 py-3 font-bold">Role</th>
                                <th className="px-4 py-3 font-bold">Joined</th>
                                <th className="px-4 py-3 font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((u: any) => (
                                <tr key={u._id} className="hover:bg-surface/50 transition">
                                    <td className="px-4 py-3 font-semibold text-primary">{u.name || '-'}</td>
                                    <td className="px-4 py-3">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'owner' ? 'bg-accent/10 text-accent' : 'bg-luxury-gray/20 text-text-secondary'}`}>
                                            <Shield size={10} /> {ROLE_LABELS[u.role] || u.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-text-secondary">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => { setEditingUser(u); setFormData({ email: u.email, name: u.name || '', role: u.role }); }}>Edit</Button>
                                            {u.role !== 'owner' && (
                                                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => { setDeleteUserId(u._id); setDeleteConfirmOpen(true); }}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
                <DialogHeader onClose={() => setShowInviteModal(false)}>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>Add a new team member to your store.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInvite} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Email *</label>
                        <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input-luxury" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-luxury" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Role</label>
                        <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="input-luxury">
                            <option value="viewer">Viewer</option>
                            <option value="packer">Packer</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline-luxury" onClick={() => setShowInviteModal(false)}>Cancel</Button>
                        <Button type="submit" variant="luxury">Invite</Button>
                    </DialogFooter>
                </form>
            </Dialog>

            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogHeader onClose={() => setEditingUser(null)}>
                    <DialogTitle>Edit Team Member</DialogTitle>
                    <DialogDescription>Update role or name.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Email</label>
                        <input type="email" value={formData.email} disabled className="input-luxury opacity-50" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-luxury" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Role</label>
                        <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="input-luxury">
                            <option value="viewer">Viewer</option>
                            <option value="packer">Packer</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline-luxury" onClick={() => setEditingUser(null)}>Cancel</Button>
                        <Button type="submit" variant="luxury">Save Changes</Button>
                    </DialogFooter>
                </form>
            </Dialog>

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Remove Team Member"
                description="Are you sure? This will revoke their access."
                confirmLabel="Remove"
                onConfirm={handleDelete}
            />
        </div>
    );
}
