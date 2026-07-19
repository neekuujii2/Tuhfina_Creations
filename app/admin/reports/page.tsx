'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Download, FileText, Calendar, Package, Users } from 'lucide-react';

export default function ReportsPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const { toast } = useToast();

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleDownload = (type: string, format: string) => {
        const params = new URLSearchParams();
        params.set('type', type);
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);
        params.set('format', format);
        window.open(`/api/reports?${params.toString()}`, '_blank');
    };

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" /></div>;
    }

    if (!user || !isAdmin) return null;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-serif font-bold text-primary">Reports</h2>
                <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">Download store reports</p>
            </div>

            <div className="bg-white border border-border rounded-[28px] p-8 shadow-soft">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Start Date</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-luxury" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">End Date</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input-luxury" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center text-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-primary">Sales Report</p>
                            <p className="text-[10px] text-text-secondary uppercase tracking-wider">All orders in date range</p>
                        </div>
                        <Button variant="luxury" size="sm" onClick={() => handleDownload('sales', 'csv')} className="flex items-center gap-1">
                            <Download size={14} /> CSV
                        </Button>
                    </div>

                    <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center text-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-primary">Inventory Report</p>
                            <p className="text-[10px] text-text-secondary uppercase tracking-wider">Current stock levels</p>
                        </div>
                        <Button variant="luxury" size="sm" onClick={() => handleDownload('inventory', 'csv')} className="flex items-center gap-1">
                            <Download size={14} /> CSV
                        </Button>
                    </div>

                    <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center text-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-primary">GST Report</p>
                            <p className="text-[10px] text-text-secondary uppercase tracking-wider">For tax filing</p>
                        </div>
                        <Button variant="luxury" size="sm" onClick={() => handleDownload('gst', 'csv')} className="flex items-center gap-1">
                            <Download size={14} /> CSV
                        </Button>
                    </div>

                    <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center text-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-primary">Customer List</p>
                            <p className="text-[10px] text-text-secondary uppercase tracking-wider">All customers with orders</p>
                        </div>
                        <Button variant="luxury" size="sm" onClick={() => handleDownload('customers', 'csv')} className="flex items-center gap-1">
                            <Download size={14} /> CSV
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
