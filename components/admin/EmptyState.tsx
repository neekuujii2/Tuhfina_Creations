'use client';

import { ReactNode } from 'react';
import { Package, ShoppingBag, LayoutDashboard, Users, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    icon?: 'products' | 'orders' | 'categories' | 'customers' | 'audit' | 'search';
    title: string;
    description: string;
    ctaLabel?: string;
    onCta?: () => void;
    secondaryCtaLabel?: string;
    onSecondaryCta?: () => void;
}

const iconMap: Record<string, ReactNode> = {
    products: <Package size={48} className="text-text-secondary" />,
    orders: <ShoppingBag size={48} className="text-text-secondary" />,
    categories: <LayoutDashboard size={48} className="text-text-secondary" />,
    customers: <Users size={48} className="text-text-secondary" />,
    audit: <FileText size={48} className="text-text-secondary" />,
    search: <Search size={48} className="text-text-secondary" />,
};

export function EmptyState({
    icon = 'search',
    title,
    description,
    ctaLabel,
    onCta,
    secondaryCtaLabel,
    onSecondaryCta,
}: EmptyStateProps) {
    return (
        <div className="text-center py-16 bg-surface border border-dashed border-border rounded-2xl p-8">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-white border border-border flex items-center justify-center">
                {iconMap[icon]}
            </div>
            <h3 className="text-lg font-serif font-bold text-primary mb-2">{title}</h3>
            <p className="text-sm text-text-secondary max-w-md mx-auto mb-6">{description}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
                {ctaLabel && onCta && (
                    <Button variant="luxury" onClick={onCta} className="rounded-full">
                        {ctaLabel}
                    </Button>
                )}
                {secondaryCtaLabel && onSecondaryCta && (
                    <Button variant="outline-luxury" onClick={onSecondaryCta} className="rounded-full">
                        {secondaryCtaLabel}
                    </Button>
                )}
            </div>
        </div>
    );
}
