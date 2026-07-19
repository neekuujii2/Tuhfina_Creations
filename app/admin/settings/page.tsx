'use client';

export const dynamic = 'force-dynamic';

import useSWR, { useSWRConfig } from 'swr';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { CATEGORIES, CategoryOffer, FestivalConfig } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Sparkles, Tag, Trash2 } from 'lucide-react';

const jewelleryCollections = [
    'Rings',
    'Earrings',
    'Necklaces',
    'Bracelets',
    'Mangalsutra',
    'Wedding Collection',
];

const ALL_ADMIN_CATEGORIES = [
    ...CATEGORIES,
    ...jewelleryCollections
];

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SettingsPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const { mutate } = useSWRConfig();

    const { data: categoryOffers = [], error: offersError, isLoading: offersLoading } = useSWR<CategoryOffer[]>('/api/category-offers', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 5000,
    });

    const { data: festivalConfig, error: festivalError, isLoading: festivalLoading } = useSWR<FestivalConfig | null>('/api/festival-config', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 5000,
    });

    const [festivalForm, setFestivalForm] = useState({
        active: false,
        bannerText: 'Festival Sale is LIVE! ✨',
        bannerSubtext: '',
        bannerImage: '',
        startAt: new Date(),
        endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const [categoryOfferForm, setCategoryOfferForm] = useState({
        category: ALL_ADMIN_CATEGORIES[0],
        discountPercent: 0,
        fixedPrice: 0,
        startAt: new Date(),
        endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        label: '',
        isFlash: false,
    });

    const [deleteOfferConfirmOpen, setDeleteOfferConfirmOpen] = useState(false);
    const [deleteOfferId, setDeleteOfferId] = useState<string | null>(null);

    useEffect(() => {
        if (festivalConfig) {
            setFestivalForm({
                active: festivalConfig.active,
                bannerText: festivalConfig.bannerText,
                bannerSubtext: festivalConfig.bannerSubtext || '',
                bannerImage: festivalConfig.bannerImage || '',
                startAt: new Date(festivalConfig.startAt),
                endAt: new Date(festivalConfig.endAt),
            });
        }
    }, [festivalConfig]);

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

    if (festivalLoading || offersLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" />
            </div>
        );
    }

    const handleFestivalToggle = async () => {
        const newValue = !festivalForm.active;
        try {
            const res = await fetch('/api/festival-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: newValue })
            });
            if (res.ok) {
                toast(`Sale ${newValue ? 'activated' : 'deactivated'}!`, 'success');
                mutate('/api/festival-config');
            } else {
                throw new Error();
            }
        } catch {
            toast('Failed to toggle sale', 'error');
        }
    };

    const handleFestivalConfigUpdate = async () => {
        try {
            const res = await fetch('/api/festival-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(festivalForm)
            });
            if (res.ok) {
                toast('Global Festival configuration saved!', 'success');
                mutate('/api/festival-config');
            } else {
                throw new Error();
            }
        } catch {
            toast('Failed to save festival configuration', 'error');
        }
    };

    const handleCategoryOfferSave = async () => {
        try {
            const res = await fetch('/api/category-offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryOfferForm)
            });
            if (res.ok) {
                toast('Category offer saved successfully!', 'success');
                mutate('/api/category-offers');
            } else {
                throw new Error();
            }
        } catch {
            toast('Failed to save category offer', 'error');
        }
    };

    const handleCategoryOfferDelete = async () => {
        if (!deleteOfferId) return;
        try {
            const res = await fetch(`/api/category-offers?id=${deleteOfferId}`, { method: 'DELETE' });
            if (res.ok) {
                toast('Category offer deleted', 'success');
                mutate('/api/category-offers');
            } else {
                throw new Error();
            }
        } catch {
            toast('Failed to delete category offer', 'error');
        } finally {
            setDeleteOfferId(null);
        }
    };

    return (
        <div className="space-y-12">
            {/* Master Festival Engine */}
            <section className="bg-white border border-border rounded-[28px] overflow-hidden shadow-soft">
                <div className="bg-primary/5 p-6 border-b border-border">
                    <h3 className="text-lg font-serif font-bold text-primary flex items-center">
                        <Sparkles className="text-accent mr-3" size={20} />
                        Master Festival Control
                    </h3>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-luxury-warm/50 rounded-2xl border border-accent/25">
                                <div>
                                    <p className="font-bold text-primary text-sm">Global Sale Status</p>
                                    <p className="text-xs text-text-secondary mt-0.5">Master toggle switch for festival banners</p>
                                </div>
                                <button
                                    onClick={handleFestivalToggle}
                                    className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                                        festivalForm.active ? 'bg-red-500 text-white' : 'bg-green-600 text-white'
                                    }`}
                                >
                                    {festivalForm.active ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Banner Main Title</label>
                                    <input
                                        type="text"
                                        className="input-luxury text-sm"
                                        value={festivalForm.bannerText}
                                        onChange={e => setFestivalForm({ ...festivalForm, bannerText: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Banner Subtext</label>
                                    <input
                                        type="text"
                                        className="input-luxury text-sm"
                                        value={festivalForm.bannerSubtext}
                                        onChange={e => setFestivalForm({ ...festivalForm, bannerSubtext: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        className="input-luxury text-sm"
                                        value={new Date(festivalForm.startAt).toISOString().slice(0, 16)}
                                        onChange={e => setFestivalForm({ ...festivalForm, startAt: new Date(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">End Time</label>
                                    <input
                                        type="datetime-local"
                                        className="input-luxury text-sm"
                                        value={new Date(festivalForm.endAt).toISOString().slice(0, 16)}
                                        onChange={e => setFestivalForm({ ...festivalForm, endAt: new Date(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleFestivalConfigUpdate}
                                variant="luxury"
                                className="w-full text-xs font-bold uppercase tracking-wider"
                            >
                                Update Festival Settings
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category-wide Offers */}
            <section className="space-y-6">
                <h3 className="text-xl font-serif font-bold text-primary flex items-center">
                    <Tag className="text-accent mr-3" size={24} />
                    Category-wide Discounts
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form */}
                    <div className="bg-luxury-warm/40 border border-accent/20 p-8 rounded-2xl space-y-6">
                        <h4 className="font-serif font-bold text-primary text-base border-b border-border pb-2">Set New Category Offer</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Target Category</label>
                                <select
                                    className="bg-white border border-border rounded-full text-sm font-semibold px-4 py-2 w-full outline-none focus:border-accent"
                                    value={categoryOfferForm.category}
                                    onChange={e => setCategoryOfferForm({ ...categoryOfferForm, category: e.target.value })}
                                >
                                    {ALL_ADMIN_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Discount Percent (%)</label>
                                <input
                                    type="number"
                                    className="input-luxury text-sm"
                                    value={categoryOfferForm.discountPercent}
                                    onChange={e => setCategoryOfferForm({ ...categoryOfferForm, discountPercent: Number(e.target.value), fixedPrice: 0 })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">OR Fixed Price (₹)</label>
                                <input
                                    type="number"
                                    className="input-luxury text-sm"
                                    value={categoryOfferForm.fixedPrice}
                                    onChange={e => setCategoryOfferForm({ ...categoryOfferForm, fixedPrice: Number(e.target.value), discountPercent: 0 })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Start Time</label>
                                <input
                                    type="datetime-local"
                                    className="input-luxury text-sm"
                                    value={new Date(categoryOfferForm.startAt).toISOString().slice(0, 16)}
                                    onChange={e => setCategoryOfferForm({ ...categoryOfferForm, startAt: new Date(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">End Time</label>
                                <input
                                    type="datetime-local"
                                    className="input-luxury text-sm"
                                    value={new Date(categoryOfferForm.endAt).toISOString().slice(0, 16)}
                                    onChange={e => setCategoryOfferForm({ ...categoryOfferForm, endAt: new Date(e.target.value) })}
                                />
                            </div>
                            <div className="col-span-2 flex items-center justify-between gap-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={categoryOfferForm.isFlash}
                                        onChange={e => setCategoryOfferForm({ ...categoryOfferForm, isFlash: e.target.checked })}
                                        className="w-5 h-5 accent-accent"
                                    />
                                    <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                                        Is Flash Sale?
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Offer Title (e.g. Diwali Deal)"
                                    className="input-luxury text-sm flex-1 max-w-[200px]"
                                    value={categoryOfferForm.label || ''}
                                    onChange={e => setCategoryOfferForm({ ...categoryOfferForm, label: e.target.value })}
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleCategoryOfferSave}
                            variant="luxury"
                            className="w-full text-xs font-bold uppercase tracking-wider"
                        >
                            Save Category Offer
                        </Button>
                    </div>

                    {/* Active Offers List */}
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {categoryOffers.map((offer: CategoryOffer) => (
                            <div key={offer._id} className="bg-white border border-border p-5 rounded-2xl flex justify-between items-center shadow-soft">
                                <div>
                                    <p className="font-serif font-bold text-primary text-base">{offer.category}</p>
                                    <p className="text-xs text-[#d4af37] font-bold mt-1 uppercase tracking-wider">
                                        {offer.discountPercent ? `${offer.discountPercent}% OFF` : `Fixed Price: ₹${offer.fixedPrice}`}
                                        {offer.isFlash && <span className="ml-2 bg-red-100 text-red-600 text-[9px] px-2 py-0.5 rounded-full">Flash</span>}
                                    </p>
                                    <p className="text-[10px] text-text-secondary mt-1 font-mono">
                                        Ends At: {new Date(offer.endAt).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setDeleteOfferId(offer._id || null);
                                        setDeleteOfferConfirmOpen(true);
                                    }}
                                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {categoryOffers.length === 0 && <p className="text-center text-text-secondary py-16 italic text-sm">No category offers active.</p>}
                    </div>
                </div>
            </section>

            <ConfirmDialog
                open={deleteOfferConfirmOpen}
                onOpenChange={setDeleteOfferConfirmOpen}
                title="Delete Offer"
                description="Are you sure you want to delete this category offer? This action cannot be undone."
                confirmLabel="Delete"
                onConfirm={handleCategoryOfferDelete}
            />
        </div>
    );
}