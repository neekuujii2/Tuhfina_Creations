'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StyleCard {
    name: string;
    image: string;
    description?: string;
    angle?: number;
    offsetX?: number;
    offsetY?: number;
    delay?: number;
}

const defaultStyles: StyleCard[] = [
    { name: 'Rings', image: '/photos/ring.jpg', angle: -3, offsetX: -20, offsetY: 10, delay: 0.1 },
    { name: 'Earrings', image: '/photos/earing.jpg', angle: 2, offsetX: 15, offsetY: -5, delay: 0.2 },
    { name: 'Necklaces', image: '/photos/nacklace.jpg', angle: -2, offsetX: -10, offsetY: -15, delay: 0.15 },
    { name: 'Bracelets', image: '/photos/bracelet1.jpg', angle: 3, offsetX: 20, offsetY: 8, delay: 0.25 },
    { name: 'Wedding', image: '/photos/wedding_ring.jpg', angle: -1, offsetX: -15, offsetY: -10, delay: 0.3 },
];

interface BrowseByStyleProps {
    styles?: StyleCard[];
}

export default function BrowseByStyle({ styles = defaultStyles }: BrowseByStyleProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section className="relative overflow-hidden py-24 sm:py-32 bg-[#111111]" ref={ref}>
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)',
                    backgroundSize: '40px 40px',
                }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08),_transparent_60%)]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Center Content */}
                <div className="text-center mb-16 sm:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge variant="gold" className="mb-5">Explore</Badge>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-5"
                    >
                        Browse by Style
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-sm sm:text-base text-white/60 max-w-md mx-auto mb-8 leading-relaxed"
                    >
                        From everyday elegance to statement pieces, find jewellery that speaks to your unique style.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex items-center justify-center gap-4"
                    >
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-[#111] shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                            style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f2d06b 50%, #d4af37 100%)' }}
                        >
                            Explore Collection
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/30"
                        >
                            Shop Now
                        </Link>
                    </motion.div>
                </div>

                {/* Floating Cards */}
                <div className="relative h-[350px] sm:h-[420px] md:h-[480px]">
                    {styles.map((style, i) => (
                        <motion.div
                            key={style.name}
                            initial={{ opacity: 0, y: 60, rotate: style.angle || 0 }}
                            animate={
                                isInView
                                    ? {
                                        opacity: 1,
                                        y: 0,
                                        rotate: style.angle || 0,
                                        x: style.offsetX || 0,
                                    }
                                    : {}
                            }
                            transition={{
                                duration: 0.8,
                                delay: style.delay || i * 0.1,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="absolute"
                            style={{
                                left: `${15 + i * 16}%`,
                                top: `${20 + (i % 2) * 25}%`,
                            }}
                        >
                            <motion.div
                                whileHover={{
                                    y: -12,
                                    rotate: 0,
                                    scale: 1.05,
                                    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                                }}
                                className="group relative w-40 h-52 sm:w-52 sm:h-64 md:w-56 md:h-72 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 cursor-pointer"
                            >
                                <Image
                                    src={style.image}
                                    alt={style.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 160px, 224px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                {/* Glass Overlay */}
                                <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                                        <Sparkles size={10} className="inline mr-1" />
                                        Collection
                                    </p>
                                    <h3 className="text-lg font-serif font-bold text-white">{style.name}</h3>
                                    {style.description && (
                                        <p className="text-xs text-white/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            {style.description}
                                        </p>
                                    )}
                                </div>

                                {/* Corner Accent */}
                                <div className="absolute top-3 right-3 w-8 h-8 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
                                    <ArrowRight size={14} className="text-white" />
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
