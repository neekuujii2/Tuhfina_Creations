'use client';

import { FestivalConfig } from '@/lib/types';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SaleBannerProps {
    config: FestivalConfig;
}

export default function SaleBanner({ config }: SaleBannerProps) {
    const now = new Date();
    const isActive = config.active &&
        now >= new Date(config.startAt) &&
        now <= new Date(config.endAt);

    if (!isActive) return null;

    return (
        <div className="relative w-full bg-gradient-to-r from-luxury-black via-luxury-gold to-luxury-black text-white py-3 px-4 overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

            <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6 text-center">
                <div className="flex items-center space-x-2">
                    <Sparkles className="text-white animate-pulse" size={20} />
                    <span className="font-serif font-bold text-sm md:text-base tracking-wide uppercase">
                        {config.bannerText}
                    </span>
                    <Sparkles className="text-white animate-pulse" size={20} />
                </div>

                {config.bannerSubtext && (
                    <span className="text-xs md:text-sm font-medium text-white/90 border-l border-white/30 pl-6 hidden md:block">
                        {config.bannerSubtext}
                    </span>
                )}

                <Link
                    href="/shop"
                    className="flex items-center space-x-2 bg-white text-luxury-black px-4 py-1 rounded-full text-xs font-bold hover:bg-luxury-cream transition-all group-hover:scale-105"
                >
                    <span>SHOP FESTIVAL SALE</span>
                    <ArrowRight size={14} />
                </Link>
            </div>

            {/* Animated Light Beam */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite]" />
        </div>
    );
}
