'use client';

export const dynamic = 'force-dynamic';

import useSWR, { useSWRConfig } from 'swr';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function StoreSettingsPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const { mutate } = useSWRConfig();

    const { data: settings, error, isLoading } = useSWR<any>('/api/settings/store', fetcher);
    const [formData, setFormData] = useState({
        phone: '',
        whatsapp: '',
        email: '',
        address: '',
        facebook: '',
        instagram: '',
        flatShippingRate: 0,
        freeShippingAbove: 0,
        codAvailable: true,
        codExtraCharge: 0,
        vacationMode: false,
        vacationMessage: '',
        vacationBackOn: '',
        gstin: '',
        legalName: '',
        legalAddress: '',
        invoicePrefix: 'INV',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setFormData({
                phone: settings.phone || '',
                whatsapp: settings.whatsapp || '',
                email: settings.email || '',
                address: settings.address || '',
                facebook: settings.facebook || '',
                instagram: settings.instagram || '',
                flatShippingRate: settings.flatShippingRate || 0,
                freeShippingAbove: settings.freeShippingAbove || 0,
                codAvailable: settings.codAvailable ?? true,
                codExtraCharge: settings.codExtraCharge || 0,
                vacationMode: settings.vacationMode || false,
                vacationMessage: settings.vacationMessage || '',
                vacationBackOn: settings.vacationBackOn ? new Date(settings.vacationBackOn).toISOString().split('T')[0] : '',
                gstin: settings.gstin || '',
                legalName: settings.legalName || '',
                legalAddress: settings.legalAddress || '',
                invoicePrefix: settings.invoicePrefix || 'INV',
            });
        }
    }, [settings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/settings/store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                toast('Store settings saved successfully', 'success');
                mutate('/api/settings/store');
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            toast('Failed to save settings', 'error');
        } finally {
            setSaving(false);
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
                <h2 className="text-2xl font-serif font-bold text-primary">Store Settings</h2>
                <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">Manage your store configuration</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <section className="bg-white border border-border rounded-[28px] p-8 shadow-soft space-y-6">
                    <h3 className="text-lg font-serif font-bold text-primary">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Phone</label>
                            <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="input-luxury" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">WhatsApp</label>
                            <input type="text" value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} className="input-luxury" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Email</label>
                            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input-luxury" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Address</label>
                            <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="input-luxury" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Facebook</label>
                            <input type="text" value={formData.facebook} onChange={e => setFormData({ ...formData, facebook: e.target.value })} className="input-luxury" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Instagram</label>
                            <input type="text" value={formData.instagram} onChange={e => setFormData({ ...formData, instagram: e.target.value })} className="input-luxury" />
                        </div>
                    </div>
                </section>

                <section className="bg-white border border-border rounded-[28px] p-8 shadow-soft space-y-6">
                    <h3 className="text-lg font-serif font-bold text-primary">Shipping Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Flat Shipping Rate (₹)</label>
                            <input type="number" value={formData.flatShippingRate} onChange={e => setFormData({ ...formData, flatShippingRate: Number(e.target.value) })} className="input-luxury" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Free Shipping Above (₹)</label>
                            <input type="number" value={formData.freeShippingAbove} onChange={e => setFormData({ ...formData, freeShippingAbove: Number(e.target.value) })} className="input-luxury" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="codAvailable" checked={formData.codAvailable} onChange={e => setFormData({ ...formData, codAvailable: e.target.checked })} className="w-5 h-5 accent-accent" />
                            <label htmlFor="codAvailable" className="text-xs font-bold uppercase tracking-wider text-text-secondary cursor-pointer">Enable COD</label>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">COD Extra Charge (₹)</label>
                            <input type="number" value={formData.codExtraCharge} onChange={e => setFormData({ ...formData, codExtraCharge: Number(e.target.value) })} className="input-luxury" />
                        </div>
                    </div>
                </section>

                <section className="bg-white border border-border rounded-[28px] p-8 shadow-soft space-y-6">
                    <h3 className="text-lg font-serif font-bold text-primary">Vacation / Holiday Mode</h3>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="vacationMode" checked={formData.vacationMode} onChange={e => setFormData({ ...formData, vacationMode: e.target.checked })} className="w-5 h-5 accent-accent" />
                        <label htmlFor="vacationMode" className="text-xs font-bold uppercase tracking-wider text-text-secondary cursor-pointer">Enable Vacation Mode</label>
                    </div>
                    {formData.vacationMode && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Vacation Message</label>
                                <input type="text" value={formData.vacationMessage} onChange={e => setFormData({ ...formData, vacationMessage: e.target.value })} className="input-luxury" placeholder="We're temporarily closed, back on [date]" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Back On Date</label>
                                <input type="date" value={formData.vacationBackOn} onChange={e => setFormData({ ...formData, vacationBackOn: e.target.value })} className="input-luxury" />
                            </div>
                        </div>
                    )}
                </section>

                <section className="bg-white border border-border rounded-[28px] p-8 shadow-soft space-y-6">
                    <h3 className="text-lg font-serif font-bold text-primary">Invoice / Tax Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">GSTIN</label>
                            <input type="text" value={formData.gstin} onChange={e => setFormData({ ...formData, gstin: e.target.value })} className="input-luxury" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Legal Business Name</label>
                            <input type="text" value={formData.legalName} onChange={e => setFormData({ ...formData, legalName: e.target.value })} className="input-luxury" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Legal Business Address</label>
                            <textarea value={formData.legalAddress} onChange={e => setFormData({ ...formData, legalAddress: e.target.value })} className="input-luxury rounded-2xl" rows={2} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Invoice Prefix</label>
                            <input type="text" value={formData.invoicePrefix} onChange={e => setFormData({ ...formData, invoicePrefix: e.target.value })} className="input-luxury" />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <Button type="submit" variant="luxury" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Store Settings'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
