'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CategoryItem {
    name: string;
    image: string;
    slug?: string;
}

const defaultCategories: CategoryItem[] = [
    { name: 'Artificial Flower Bouquet', image: '/photos/ring1.jpg', slug: 'Artificial Flower Bouquet' },
    { name: 'Customized Earrings', image: '/photos/earing1.jpg', slug: 'Customized Earrings' },
    { name: 'Customized Rings', image: '/photos/wedding_ring.jpg', slug: 'Customized Rings' },
    { name: 'Luxury Frames', image: '/photos/ring_nacklace.jpg', slug: 'Luxury Frames' },
    { name: 'Gift Hampers', image: '/photos/bracelet1.jpg', slug: 'Gift Hampers' },
    { name: 'Artificial Flowers', image: '/photos/earing_nacklace.jpg', slug: 'Artificial Flowers' },
    { name: 'Necklaces', image: '/photos/naclace2.jpg', slug: 'Necklaces' },
    { name: 'Bracelets', image: '/photos/men_bracelet.jpg', slug: 'Bracelets' },
    { name: 'Wedding Gifts', image: '/photos/nacklace.jpg', slug: 'Wedding Gifts' },
    { name: 'Home Decor', image: '/photos/ring.jpg', slug: 'Home Decor' },
    { name: 'Luxury Keepsakes', image: '/photos/earing.jpg', slug: 'Luxury Keepsakes' },
    { name: 'Premium Gift Boxes', image: '/photos/ring1.jpg', slug: 'Premium Gift Boxes' },
];

interface FeaturedCategoriesProps {
    categories?: CategoryItem[];
}

export default function FeaturedCategories({ categories = defaultCategories }: FeaturedCategoriesProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section ref={ref} className="relative py-24 sm:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-12"
                >
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d4af37] mb-2">
                            Curated For You
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111]">
                            Featured Categories
                        </h2>
                    </div>
                    <Link
                        href="/shop"
                        className="text-xs font-bold uppercase tracking-wider text-[#666] hover:text-[#b76e79] transition duration-300 inline-flex items-center gap-1.5"
                    >
                        View all categories
                        <ArrowRight size={14} />
                    </Link>
                </motion.div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-5">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.6,
                                delay: i * 0.05,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        >
                            <Link
                                href={`/shop?category=${encodeURIComponent(cat.slug || cat.name)}`}
                                className="group block"
                            >
                                <motion.div
                                    whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                                    className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#e5e5e5]/50 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] hover:border-[#d4af37]/20"
                                >
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                    {/* Hover Shine Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-sm sm:text-base font-serif font-bold text-white mb-1.5 leading-tight">
                                            {cat.name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#d4af37] opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                                            <span>Shop Now</span>
                                            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
