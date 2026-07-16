'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
    name: string;
    image?: string;
    description?: string;
    icon?: string;
}

export default function CategoryCard({ name, image, description, icon = '💎' }: CategoryCardProps) {
    return (
        <Link href={`/shop?category=${encodeURIComponent(name)}`} className="group block h-full">
            <motion.div 
                className="relative h-80 overflow-hidden rounded-[24px] border border-border shadow-soft bg-luxury-warm"
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
            >
                {/* Background Image / Gradient */}
                {image ? (
                    <div className="absolute inset-0 h-full w-full">
                        <Image
                            src={image}
                            alt={name}
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-luxury-warm to-[#efdfcf]/60">
                        <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">{icon}</span>
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                    </div>
                )}

                {/* Card Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white h-1/2">
                    {/* Glassmorphism Panel */}
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-md transition-all duration-300 group-hover:bg-black/35">
                        <h3 className="font-serif text-xl font-bold tracking-tight text-white mb-1">
                            {name}
                        </h3>
                        <p className="text-xs text-white/80 line-clamp-1 mb-2 font-sans font-light">
                            {description || 'Explore our exclusive designer collection.'}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-accent group-hover:text-white transition-colors duration-300">
                            <span>Shop Now</span>
                            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
