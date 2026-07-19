'use client';

export const dynamic = 'force-dynamic';

import useSWR, { useSWRConfig } from 'swr';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ContentPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const { mutate } = useSWRConfig();

    const { data: content, error, isLoading } = useSWR<any>('/api/content', fetcher);
    const [formData, setFormData] = useState({
        heroImage: '',
        heroHeading: 'Welcome to Tuhfina Creations',
        heroSubheading: 'Handcrafted with love',
        heroCtaText: 'Shop Now',
        heroCtaLink: '/products',
        announcementText: '',
        announcementEnabled: false,
    });
    const [saving, setSaving] = useState(false);

    const [policySlug, setPolicySlug] = useState('return');
    const [policyContent, setPolicyContent] = useState('');
    const [policies, setPolicies] = useState<any>(null);
    const [loadingPolicies, setLoadingPolicies] = useState(false);

    useEffect(() => {
        if (content) {
            setFormData({
                heroImage: content.heroImage || '',
                heroHeading: content.heroHeading || 'Welcome to Tuhfina Creations',
                heroSubheading: content.heroSubheading || 'Handcrafted with love',
                heroCtaText: content.heroCtaText || 'Shop Now',
                heroCtaLink: content.heroCtaLink || '/products',
                announcementText: content.announcementText || '',
                announcementEnabled: content.announcementEnabled || false,
            });
        }
    }, [content]);

    const handleSaveContent = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                toast('Content saved successfully', 'success');
                mutate('/api/content');
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            toast('Failed to save content', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSavePolicy = async () => {
        setLoadingPolicies(true);
        try {
            const res = await fetch('/api/content/policies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug: policySlug, content: policyContent }),
            });
            if (res.ok) {
                toast('Policy saved successfully', 'success');
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            toast('Failed to save policy', 'error');
        } finally {
            setLoadingPolicies(false);
        }
    };

    const loadPolicies = async () => {
        setLoadingPolicies(true);
        try {
            const res = await fetch('/api/content/policies');
            const data = await res.json();
            setPolicies(data);
        } catch (error) {
            toast('Failed to load policies', 'error');
        } finally {
            setLoadingPolicies(false);
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
                <h2 className="text-2xl font-serif font-bold text-primary">Content Management</h2>
                <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">Manage homepage and policies</p>
            </div>

            <form onSubmit={handleSaveContent} className="space-y-8">
                <section className="bg-white border border-border rounded-[28px] p-8 shadow-soft space-y-6">
                    <h3 className="text-lg font-serif font-bold text-primary">Homepage Banner</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Hero Image URL</label>
                            <input type="text" value={formData.heroImage} onChange={e => setFormData({ ...formData, heroImage: e.target.value })} className="input-luxury" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Heading</label>
                            <input type="text" value={formData.heroHeading} onChange={e => setFormData({ ...formData, heroHeading: e.target.value })} className="input-luxury" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Subheading</label>
                            <input type="text" value={formData.heroSubheading} onChange={e => setFormData({ ...formData, heroSubheading: e.target.value })} className="input-luxury" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">CTA Text</label>
                                <input type="text" value={formData.heroCtaText} onChange={e => setFormData({ ...formData, heroCtaText: e.target.value })} className="input-luxury" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">CTA Link</label>
                                <input type="text" value={formData.heroCtaLink} onChange={e => setFormData({ ...formData, heroCtaLink: e.target.value })} className="input-luxury" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white border border-border rounded-[28px] p-8 shadow-soft space-y-6">
                    <h3 className="text-lg font-serif font-bold text-primary">Announcement Bar</h3>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="announcementEnabled" checked={formData.announcementEnabled} onChange={e => setFormData({ ...formData, announcementEnabled: e.target.checked })} className="w-5 h-5 accent-accent" />
                        <label htmlFor="announcementEnabled" className="text-xs font-bold uppercase tracking-wider text-text-secondary cursor-pointer">Show Announcement</label>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Announcement Message</label>
                        <input type="text" value={formData.announcementText} onChange={e => setFormData({ ...formData, announcementText: e.target.value })} className="input-luxury" placeholder="Free shipping on orders above ₹999!" />
                    </div>
                </section>

                <div className="flex justify-end">
                    <Button type="submit" variant="luxury" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Content'}
                    </Button>
                </div>
            </form>

            <section className="bg-white border border-border rounded-[28px] p-8 shadow-soft space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-serif font-bold text-primary">Policy Pages</h3>
                    <Button variant="outline-luxury" size="sm" onClick={loadPolicies}>Load Policies</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Select Policy</label>
                        <select value={policySlug} onChange={e => setPolicySlug(e.target.value)} className="input-luxury">
                            <option value="return">Return Policy</option>
                            <option value="refund">Refund Policy</option>
                            <option value="privacy">Privacy Policy</option>
                            <option value="terms">Terms & Conditions</option>
                            <option value="shipping">Shipping Policy</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Policy Content (HTML)</label>
                        <textarea value={policyContent} onChange={e => setPolicyContent(e.target.value)} className="input-luxury rounded-2xl" rows={8} />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button variant="luxury" onClick={handleSavePolicy} disabled={loadingPolicies}>
                        {loadingPolicies ? 'Saving...' : 'Save Policy'}
                    </Button>
                </div>
            </section>
        </div>
    );
}
