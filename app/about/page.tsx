'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState, useMemo } from 'react';

export const dynamic = 'force-dynamic';

import {
    ArrowRight, Gem, Heart, ShieldCheck, Sparkles, BadgeCheck, Quote, Star, Truck, Users, Award, Clock, PackageOpen, RefreshCcw, Headphones, Phone, Mail, MapPin, Play, X, ChevronLeft, ChevronRight, Gift,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const videos = [
    '/videos/crafting-process.mp4',
    '/videos/crafting-process12.mp4',
    '/videos/istockphoto-1392221473-640_adpp_is.mp4',
    '/videos/istockphoto-1493725196-640_adpp_is.mp4',
    '/videos/istockphoto-1493932124-640_adpp_is.mp4',
];

const photos = [
    '/photos/ring.jpg', '/photos/ring1.jpg', '/photos/ring2.jpg', '/photos/ring3.jpg', '/photos/ring4.jpg',
    '/photos/nacklace.jpg', '/photos/naclace2.jpg', '/photos/earing.jpg', '/photos/earing1.jpg',
    '/photos/bracelet.jpg', '/photos/bracelet1.jpg', '/photos/wedding_ring.jpg', '/photos/ring_nacklace.jpg', '/photos/earing_nacklace.jpg',
];

const testimonials = [
    { name: 'Priya Sharma', role: 'Bride', image: '/photos/earing1.jpg', rating: 5, text: 'Absolutely stunning! My wedding jewellery from Tuhfina Creation exceeded all expectations. The craftsmanship is impeccable.' },
    { name: 'Ananya Reddy', role: 'Customer', image: '/photos/nacklace.jpg', rating: 5, text: 'The customization service is amazing. They created exactly what I envisioned for my anniversary gift.' },
    { name: 'Meera Kapoor', role: 'Customer', image: '/photos/ring1.jpg', rating: 5, text: 'Beautiful pieces and fast delivery. The packaging was so luxurious, it felt like a premium unboxing experience.' },
    { name: 'Kavya Nair', role: 'Customer', image: '/photos/bracelet1.jpg', rating: 5, text: 'I have ordered multiple times and each piece is a masterpiece. The attention to detail is remarkable.' },
    { name: 'Riya Singh', role: 'Customer', image: '/photos/wedding_ring.jpg', rating: 5, text: 'The bridal collection is breathtaking. Every piece tells a story of artistry and tradition.' },
];

const timeline = [
    { year: '2018', title: 'Dream Started', description: 'Tuhfina Creations was founded with a vision to blend traditional Indian craftsmanship with contemporary luxury design.' },
    { year: '2019', title: 'First Collection', description: 'Launched our debut collection of handcrafted gold-plated jewellery, receiving overwhelming appreciation from early patrons.' },
    { year: '2021', title: 'Handmade Excellence', description: 'Expanded our atelier and trained over 20 master artisans, refining our techniques for precision and quality.' },
    { year: '2023', title: 'Thousands Happy', description: 'Crossed 5,000+ happy customers and introduced fully customizable jewellery lines for personal storytelling.' },
    { year: '2025', title: 'Growing Luxury Brand', description: 'Expanded internationally while staying true to our roots in artisan excellence and customer delight.' },
];

const values = [
    { icon: Award, title: 'Premium Quality', text: 'Only the finest materials and finishing techniques, certified for lasting beauty.' },
    { icon: Heart, title: 'Crafted with Love', text: 'Every piece is made with passion, care, and an unwavering attention to detail.' },
    { icon: Sparkles, title: 'Sustainable Materials', text: 'Ethically sourced metals and stones, responsibly crafted for a better tomorrow.' },
    { icon: Gift, title: 'Memorable Gifts', text: 'Luxury packaging and personalization that turns every gift into a cherished memory.' },
    { icon: Clock, title: 'Timeless Designs', text: 'Classic elegance meets modern sensibility — designs meant to be treasured for generations.' },
    { icon: Truck, title: 'Safe Delivery', text: 'Fully insured, secure packaging and reliable delivery across India and beyond.' },
];

const whyChooseUs = [
    { icon: Gem, title: 'Premium Materials', text: 'Hypoallergenic, gold-plated, and stone-set with precision.' },
    { icon: BadgeCheck, title: 'Certified Quality', text: 'Every piece is inspected and certified for authenticity.' },
    { icon: Heart, title: 'Handcrafted Jewellery', text: 'Made by skilled artisans with decades of experience.' },
    { icon: Truck, title: 'Fast Shipping', text: 'Pan-India express delivery with real-time tracking.' },
    { icon: RefreshCcw, title: 'Easy Returns', text: '7-day hassle-free returns on unused items.' },
    { icon: Headphones, title: '24×7 Support', text: 'Dedicated customer care via call, chat, or email.' },
];

const process = [
    { step: '01', title: 'Design', text: 'Our designers sketch each piece with precision, balancing tradition and modernity.' },
    { step: '02', title: 'Handcraft', text: 'Master artisans handcraft every detail using techniques passed down through generations.' },
    { step: '03', title: 'Quality Inspection', text: 'Each creation undergoes rigorous inspection to ensure flawless finishing.' },
    { step: '04', title: 'Packaging', text: 'Luxury gift-ready packaging with personalized touches for a premium unboxing.' },
    { step: '05', title: 'Delivery', text: 'Safe, insured, and express delivery to your doorstep with full tracking.' },
];

const achievements = [
    { value: 5000, suffix: '+', label: 'Happy Customers' },
    { value: 1000, suffix: '+', label: 'Luxury Products' },
    { value: 4.9, suffix: '★', label: 'Average Rating' },
    { value: 100, suffix: '%', label: 'Handcrafted Quality' },
];

function FadeInSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function HeroBackground() {
    const [index, setIndex] = useState(0);
    const isVideo = (src: string) => src.endsWith('.mp4');
    const items = useMemo(() => [...videos, ...photos], []);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % items.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [items.length]);

    return (
        <div className="absolute inset-0">
            {items.map((src, i) => (
                <motion.div
                    key={src}
                    className="absolute inset-0"
                    animate={{ opacity: i === index ? 1 : 0 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                >
                    {isVideo(src) ? (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="h-full w-full object-cover scale-105 animate-ken-burns"
                            poster="/images/hero-poster.jpg"
                        >
                            <source src={src} type="video/mp4" />
                        </video>
                    ) : (
                        <Image
                            src={src}
                            alt=""
                            fill
                            className="object-cover scale-105 animate-ken-burns"
                        />
                    )}
                </motion.div>
            ))}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/50" />
        </div>
    );
}

function PhotoGallery() {
    const [lightbox, setLightbox] = useState<string | null>(null);

    return (
        <section className="section-padding bg-luxury-warm/10">
            <div className="section-shell">
                <FadeInSection className="text-center mb-12">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-3">Gallery</p>
                    <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Photo Gallery</h2>
                </FadeInSection>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((src, i) => (
                        <FadeInSection key={src} delay={i * 0.06}>
                            <motion.div
                                className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
                                whileHover={{ y: -4, scale: 1.02 }}
                                onClick={() => setLightbox(src)}
                            >
                                <Image src={src} alt={`Gallery ${i + 1}`} fill className="object-cover transition-transform duration-700 hover:scale-110" />
                                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Sparkles className="text-white" size={24} />
                                </div>
                            </motion.div>
                        </FadeInSection>
                    ))}
                </div>

                <AnimatePresence>
                    {lightbox && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                            onClick={() => setLightbox(null)}
                        >
                            <button className="absolute top-6 right-6 text-white/80 hover:text-white" onClick={() => setLightbox(null)}>
                                <X size={32} />
                            </button>
                            <div className="relative max-w-4xl max-h-[80vh]">
                                <Image src={lightbox} alt="Lightbox" width={1200} height={800} className="object-contain max-h-[80vh] rounded-2xl" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

function VideoGallery() {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    return (
        <section className="section-padding bg-background">
            <div className="section-shell">
                <FadeInSection className="text-center mb-12">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-3">Showcase</p>
                    <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Video Gallery</h2>
                </FadeInSection>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.slice(0, 6).map((src, i) => (
                        <FadeInSection key={src} delay={i * 0.08}>
                            <motion.div
                                className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-luxury-black cursor-pointer group"
                                whileHover={{ y: -4 }}
                                onClick={() => setActiveVideo(src)}
                            >
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                    poster="/images/hero-poster.jpg"
                                >
                                    <source src={src} type="video/mp4" />
                                </video>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform">
                                        <Play className="text-white ml-1" size={24} />
                                    </div>
                                </div>
                            </motion.div>
                        </FadeInSection>
                    ))}
                </div>

                <AnimatePresence>
                    {activeVideo && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                            onClick={() => setActiveVideo(null)}
                        >
                            <button className="absolute top-6 right-6 text-white/80 hover:text-white" onClick={() => setActiveVideo(null)}>
                                <X size={32} />
                            </button>
                            <div className="relative w-full max-w-4xl aspect-video">
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full rounded-2xl"
                                    controls
                                >
                                    <source src={activeVideo} type="video/mp4" />
                                </video>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

function AnimatedCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    useEffect(() => {
        if (!isInView) return;
        let startTime: number | null = null;
        const duration = 2000;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isInView, value]);

    return (
        <div ref={ref} className="text-center">
            <p className="text-4xl md:text-5xl font-serif font-bold text-luxury-gold">
                {count}{suffix}
            </p>
            <p className="mt-2 text-sm text-text-secondary uppercase tracking-wider">{label}</p>
        </div>
    );
}

export default function AboutPage() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-background overflow-x-hidden">
            {/* Hero */}
            <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
                <HeroBackground />
                <div className="section-shell relative z-10 px-4 sm:px-6 lg:px-10 xl:px-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mb-8 inline-flex items-center gap-2 rounded-full border border-luxury-gold/30 bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-luxury-gold backdrop-blur-md"
                        >
                            <Sparkles size={14} className="text-luxury-gold" />
                            About Us
                        </motion.div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.05] tracking-tight">
                            Crafting Timeless{' '}
                            <span className="luxury-text-gradient">Elegance</span>
                        </h1>

                        <p className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl text-white/75 leading-relaxed font-light">
                            Every piece tells a story of love, craftsmanship, and luxury.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/shop" className="btn-gold px-10 py-4 text-sm uppercase font-bold tracking-wider rounded-full hover:scale-105 transition duration-300">
                                Explore Collection
                            </Link>
                            <Link href="#our-story" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-10 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/50">
                                Our Story
                            </Link>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="flex flex-col items-center gap-2"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Scroll</span>
                        <div className="h-10 w-px bg-gradient-to-b from-white/50 to-transparent" />
                    </motion.div>
                </motion.div>
            </section>

            {/* About Tuhfina */}
            <section className="section-padding" id="about">
                <div className="section-shell">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <FadeInSection>
                            <Badge variant="gold" className="mb-4">About Tuhfina</Badge>
                            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-6">
                                Where Luxury Meets Legacy
                            </h2>
                            <p className="text-base leading-relaxed text-text-secondary mb-6">
                                Tuhfina Creations is a premier luxury jewellery house dedicated to crafting timeless pieces that celebrate life&apos;s most cherished moments. From handcrafted gold-plated masterpieces to bespoke custom designs, every creation embodies our passion for perfection.
                            </p>
                            <p className="text-base leading-relaxed text-text-secondary mb-8">
                                Our mission is to blend India&apos;s rich artisan heritage with contemporary luxury, creating jewellery that not only adorns but also tells a story — your story.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {[
                                    { title: 'Our Mission', text: 'To craft meaningful, heirloom-quality jewellery that celebrates life\'s most cherished milestones.' },
                                    { title: 'Our Vision', text: 'To become the most trusted name in bespoke luxury gifting, recognised globally for artistry and integrity.' },
                                ].map((item) => (
                                    <div key={item.title} className="p-6 rounded-2xl border border-border bg-surface">
                                        <h3 className="font-serif font-bold text-primary mb-2">{item.title}</h3>
                                        <p className="text-sm text-text-secondary leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeInSection>

                        <FadeInSection delay={0.15}>
                            <div className="grid grid-cols-2 gap-4">
                                {['/photos/ring1.jpg', '/photos/nacklace.jpg', '/photos/earing.jpg', '/photos/bracelet1.jpg'].map((src, i) => (
                                    <motion.div
                                        key={src}
                                        className={`relative aspect-[3/4] overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                                        whileHover={{ y: -4, scale: 1.02 }}
                                    >
                                        <Image src={src} alt={`Luxury jewellery ${i + 1}`} fill className="object-cover" />
                                    </motion.div>
                                ))}
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* Our Story Timeline */}
            <section className="section-padding bg-luxury-warm/20 border-y border-border" id="our-story">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Our Journey</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">The Tuhfina Story</h2>
                    </FadeInSection>

                    <div className="relative">
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
                        <div className="space-y-12">
                            {timeline.map((item, i) => (
                                <FadeInSection key={item.year} delay={i * 0.1}>
                                    <div className={`relative flex flex-col md:flex-row gap-6 md:gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                        <div className="md:w-1/2 pl-12 md:pl-0">
                                            <div className="p-6 rounded-[24px] border border-border bg-surface transition-all duration-500 hover:shadow-premium hover:border-luxury-gold/20">
                                                <p className="text-xs font-bold uppercase tracking-wider text-luxury-gold mb-1">{item.year}</p>
                                                <h3 className="text-xl font-serif font-bold text-primary mb-2">{item.title}</h3>
                                                <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                        <div className="absolute left-4 md:left-1/2 top-6 w-3 h-3 rounded-full bg-luxury-gold border-2 border-white md:-translate-x-1.5 shadow-glow" />
                                    </div>
                                </FadeInSection>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="section-padding">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Values</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">What We Stand For</h2>
                    </FadeInSection>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {values.map((val, i) => {
                            const Icon = val.icon;
                            return (
                                <FadeInSection key={val.title} delay={i * 0.1}>
                                    <div className="group relative h-full rounded-[24px] border border-border bg-surface p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-premium hover:border-luxury-gold/20 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative z-10">
                                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/10 transition-all duration-500 group-hover:bg-luxury-gold group-hover:text-white group-hover:scale-110 group-hover:rotate-3">
                                                <Icon size={24} />
                                            </div>
                                            <h3 className="text-lg font-serif font-bold text-primary mb-2">{val.title}</h3>
                                            <p className="text-sm leading-relaxed text-text-secondary">{val.text}</p>
                                        </div>
                                    </div>
                                </FadeInSection>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section-padding bg-luxury-warm/20 border-y border-border">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Why Choose Us</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">The Tuhfina Difference</h2>
                    </FadeInSection>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {whyChooseUs.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <FadeInSection key={item.title} delay={i * 0.1}>
                                    <div className="group rounded-[24px] border border-border bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-premium hover:border-luxury-gold/20 text-center">
                                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/10 transition-all duration-500 group-hover:bg-luxury-gold group-hover:text-white group-hover:scale-110 group-hover:rotate-3">
                                            <Icon size={24} />
                                        </div>
                                        <h3 className="text-lg font-serif font-bold text-primary mb-2">{item.title}</h3>
                                        <p className="text-sm leading-relaxed text-text-secondary">{item.text}</p>
                                    </div>
                                </FadeInSection>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Our Process */}
            <section className="section-padding">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Process</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">How We Create</h2>
                    </FadeInSection>

                    <div className="relative">
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
                        <div className="space-y-12">
                            {process.map((item, i) => (
                                <FadeInSection key={item.step} delay={i * 0.1}>
                                    <div className={`relative flex flex-col md:flex-row gap-6 md:gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                        <div className="md:w-1/2 pl-12 md:pl-0">
                                            <div className="p-6 rounded-[24px] border border-border bg-surface transition-all duration-500 hover:shadow-premium">
                                                <p className="text-xs font-bold uppercase tracking-wider text-luxury-gold mb-1">Step {item.step}</p>
                                                <h3 className="text-xl font-serif font-bold text-primary mb-2">{item.title}</h3>
                                                <p className="text-sm text-text-secondary leading-relaxed">{item.text}</p>
                                            </div>
                                        </div>
                                        <div className="absolute left-4 md:left-1/2 top-6 w-3 h-3 rounded-full bg-luxury-gold border-2 border-white md:-translate-x-1.5 shadow-glow" />
                                    </div>
                                </FadeInSection>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Founder Message */}
            <section className="section-padding bg-luxury-warm/20 border-y border-border">
                <div className="section-shell">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <FadeInSection>
                            <div className="relative aspect-[4/3] rounded-[28px] overflow-hidden bg-gradient-to-br from-luxury-gold/10 to-accent/10 border border-border">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-7xl font-serif font-bold text-luxury-gold/20 select-none">F</span>
                                </div>
                            </div>
                        </FadeInSection>
                        <FadeInSection delay={0.15}>
                            <Badge variant="gold" className="mb-4">Founder&apos;s Message</Badge>
                            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-6">Rooted in Passion</h2>
                            <div className="relative p-6 rounded-2xl border border-border bg-white mb-6">
                                <Quote className="absolute top-4 right-4 text-luxury-gold/10 h-8 w-8" />
                                <p className="text-base leading-relaxed text-text-secondary italic">
                                    &ldquo;What began as a personal quest for meaningful, handcrafted jewellery soon became a calling. Our founder spent years apprenticing with master craftspeople across India, learning the secrets of traditional metallurgy and stone setting. Today, that same spirit of curiosity and dedication drives every Tuhfina creation.&rdquo;
                                </p>
                            </div>
                            <p className="text-base leading-relaxed text-text-secondary mb-8">
                                Each piece is a bridge between heritage and modernity — crafted to be treasured for generations.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-luxury-gold/20 to-accent/20 flex items-center justify-center text-sm font-bold text-luxury-gold font-serif border border-luxury-gold/20">
                                    TC
                                </div>
                                <div>
                                    <h4 className="font-serif font-bold text-primary">Tuhfina Creations</h4>
                                    <p className="text-xs text-text-secondary">Founder & Creative Director</p>
                                </div>
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* Achievements */}
            <section className="section-padding">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Achievements</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">By The Numbers</h2>
                    </FadeInSection>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {achievements.map((item, i) => (
                            <FadeInSection key={item.label} delay={i * 0.1}>
                                <AnimatedCounter {...item} />
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section-padding bg-luxury-warm/20 border-y border-border">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Testimonials</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">What Our Clients Say</h2>
                    </FadeInSection>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="overflow-hidden">
                            <motion.div
                                className="flex"
                                animate={{ x: `-${currentTestimonial * 100}%` }}
                                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                            >
                                {testimonials.map((t, i) => (
                                    <div key={i} className="w-full flex-shrink-0 px-4">
                                        <div className="glass-panel rounded-[28px] p-8 md:p-12 text-center">
                                            <div className="flex justify-center mb-6">
                                                <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-luxury-gold/40 shadow-premium">
                                                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                                                </div>
                                            </div>
                                            <div className="flex justify-center gap-1 mb-4">
                                                {Array.from({ length: t.rating }).map((_, idx) => (
                                                    <Star key={idx} size={18} className="fill-luxury-gold text-luxury-gold" />
                                                ))}
                                            </div>
                                            <p className="text-lg md:text-xl font-light text-primary/90 leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                                            <h4 className="font-serif font-bold text-primary text-lg">{t.name}</h4>
                                            <p className="text-sm text-text-secondary">{t.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        <div className="flex justify-center gap-3 mt-8">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentTestimonial(i)}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${i === currentTestimonial ? 'w-8 bg-luxury-gold' : 'w-2.5 bg-luxury-gold/30 hover:bg-luxury-gold/60'}`}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Photo Gallery */}
            <PhotoGallery />

            {/* Video Gallery */}
            <VideoGallery />

            {/* CTA */}
            <section className="relative overflow-hidden bg-primary py-24 text-white">
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(212,175,55,0.15),_transparent_50%)]" />

                <FadeInSection className="section-shell relative z-10 px-4 sm:px-6 lg:px-10 xl:px-16 text-center max-w-3xl">
                    <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
                        Celebrate Every Moment with Timeless Jewellery
                    </h2>
                    <p className="text-white/70 text-base leading-relaxed mb-8">
                        Explore our collections and find a piece that speaks to your journey.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/shop" className="btn-gold px-8 py-3.5 text-xs uppercase font-bold tracking-wider rounded-full hover:scale-105 transition duration-300">
                            Explore Collection
                        </Link>
                        <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/50">
                            Contact Us
                        </Link>
                    </div>
                </FadeInSection>
            </section>

            {/* Footer Transition */}
            <div className="relative h-16 bg-background">
                <svg className="absolute bottom-0 w-full h-16 text-white" viewBox="0 0 1440 60" preserveAspectRatio="none">
                    <path d="M0,60 C480,0 960,0 1440,60 L1440,120 L0,120 Z" fill="currentColor" />
                </svg>
            </div>
        </div>
    );
}
