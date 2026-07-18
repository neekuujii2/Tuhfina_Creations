'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
    image: string;
    title: string;
    subtitle: string;
    cta: string;
    href: string;
    overlay?: string;
}

const defaultSlides: Slide[] = [
    {
        image: '/photos/nacklace.jpg',
        title: 'Luxury Jewellery Collection',
        subtitle: 'Discover timeless elegance crafted for modern royalty',
        cta: 'Shop Now',
        href: '/shop',
    },
    {
        image: '/photos/wedding_ring.jpg',
        title: 'Wedding Collection',
        subtitle: 'Bridal treasures for your most cherished moments',
        cta: 'Explore',
        href: '/shop?category=Wedding',
    },
    {
        image: '/photos/ring.jpg',
        title: 'Flat 20% Off',
        subtitle: 'Limited time offer on curated luxury pieces',
        cta: 'Grab Deal',
        href: '/shop',
    },
    {
        image: '/photos/earing.jpg',
        title: 'Festival Collection',
        subtitle: 'Celebrate in style with our festive special pieces',
        cta: 'View Collection',
        href: '/shop',
    },
];

interface PromoSliderProps {
    slides?: Slide[];
}

export default function PromoSlider({ slides = defaultSlides }: PromoSliderProps) {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    const goTo = useCallback((index: number) => {
        setDirection(index > current ? 1 : -1);
        setCurrent(index);
    }, [current]);

    const next = useCallback(() => {
        setDirection(1);
        setCurrent((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prev = useCallback(() => {
        setDirection(-1);
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    const slide = slides[current];

    const variants = {
        enter: (direction: number) => ({
            opacity: 0,
            scale: 1.05,
            x: direction > 0 ? 60 : -60,
        }),
        center: {
            opacity: 1,
            scale: 1,
            x: 0,
        },
        exit: (direction: number) => ({
            opacity: 0,
            scale: 0.98,
            x: direction > 0 ? -60 : 60,
        }),
    };

    return (
        <section className="relative overflow-hidden">
            <div className="relative h-[50vh] min-h-[400px] max-h-[550px] sm:h-[55vh] md:h-[60vh]">
                {/* Background Image */}
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={current}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={current === 0}
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </motion.div>
                </AnimatePresence>

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <AnimatePresence custom={direction} mode="wait">
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                className="max-w-xl"
                            >
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#d4af37] mb-4"
                                >
                                    Tuhfina Creation
                                </motion.p>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-4">
                                    {slide.title}
                                </h2>
                                <p className="text-sm sm:text-base text-white/75 mb-8 max-w-md leading-relaxed">
                                    {slide.subtitle}
                                </p>
                                <Link
                                    href={slide.href}
                                    className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                                    style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f2d06b 50%, #d4af37 100%)' }}
                                >
                                    {slide.cta}
                                    <ArrowRight size={16} />
                                </Link>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105"
                    aria-label="Next slide"
                >
                    <ChevronRight size={20} />
                </button>

                {/* Pagination Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`rounded-full transition-all duration-400 ${
                                i === current
                                    ? 'w-8 h-2.5 bg-[#d4af37]'
                                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
