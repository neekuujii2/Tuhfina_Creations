'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useMemo } from 'react';
import { ArrowRight, Gem, ShieldCheck, Truck, Users, Play, Sparkles, Star, Instagram, Facebook, Youtube, Linkedin, Mail, Phone, MapPin, Clock, Heart, ShoppingCart, Eye, Award, TruckIcon, RefreshCcw, Headphones, PackageOpen } from 'lucide-react';
import { Product, Category, CategoryOffer, FestivalConfig } from '@/lib/types';
import ProductCard from '@/components/cards/ProductCard';
import SaleBanner from '@/components/SaleBanner';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/toast';

interface HomeClientProps {
    products: Product[];
    categories: Category[];
    settings: any;
    festivalConfig: FestivalConfig | null;
    categoryOffers: CategoryOffer[];
}

const stats = [
    { icon: Users, value: 500, suffix: '+', label: 'Happy Customers' },
    { icon: Gem, value: 100, suffix: '%', label: 'Handmade' },
    { icon: Truck, value: 100, suffix: '%', label: 'Free Pan-India Shipping' },
    { icon: ShieldCheck, value: 100, suffix: '%', label: 'Certified Quality' },
];

const trustSignals = [
    { icon: TruckIcon, title: 'Free Shipping', desc: 'On all orders above ₹999' },
    { icon: ShieldCheck, title: 'Secure Payments', desc: '100% secure checkout' },
    { icon: RefreshCcw, title: 'Easy Returns', desc: '7-day hassle-free returns' },
    { icon: Headphones, title: '24×7 Support', desc: 'Dedicated customer care' },
    { icon: Award, title: 'Premium Quality', desc: 'Certified materials only' },
    { icon: PackageOpen, title: 'Gift Packaging', desc: 'Luxury ready-to-gift wrap' },
    { icon: Clock, title: 'Fast Delivery', desc: 'Pan-India express shipping' },
    { icon: Gem, title: 'Certified Jewellery', desc: 'Hallmark & quality assured' },
];

const testimonials = [
    { name: 'Priya Sharma', role: 'Bride', image: '/photos/earing1.jpg', rating: 5, text: 'Absolutely stunning! My wedding jewellery from Tuhfina Creation exceeded all expectations. The craftsmanship is impeccable.' },
    { name: 'Ananya Reddy', role: 'Customer', image: '/photos/nacklace.jpg', rating: 5, text: 'The customization service is amazing. They created exactly what I envisioned for my anniversary gift.' },
    { name: 'Meera Kapoor', role: 'Customer', image: '/photos/ring1.jpg', rating: 5, text: 'Beautiful pieces and fast delivery. The packaging was so luxurious, it felt like a premium unboxing experience.' },
    { name: 'Kavya Nair', role: 'Customer', image: '/photos/bracelet1.jpg', rating: 5, text: 'I have ordered multiple times and each piece is a masterpiece. The attention to detail is remarkable.' },
    { name: 'Riya Singh', role: 'Customer', image: '/photos/wedding_ring.jpg', rating: 5, text: 'The bridal collection is breathtaking. Every piece tells a story of artistry and tradition.' },
];

const instagramPosts = [
    '/photos/earing.jpg', '/photos/ring.jpg', '/photos/nacklace.jpg',
    '/photos/bracelet.jpg', '/photos/ring1.jpg', '/photos/earing1.jpg',
];

const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/tuhfinacreation' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/tuhfinacreation' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@tuhfinacreation' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/tuhfinacreation' },
    { name: 'WhatsApp', icon: Phone, href: 'https://wa.me/919873531273' },
];

function useCountUp(end: number, duration: number = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    useEffect(() => {
        if (!isInView) return;
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isInView, end, duration]);

    return { count, ref };
}

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

function HeroVideoSlider() {
    const [index, setIndex] = useState(0);
    const videos = useMemo(() => [
        '/videos/crafting-process.mp4',
        '/videos/crafting-process12.mp4',
        '/videos/istockphoto-1392221473-640_adpp_is.mp4',
        '/videos/istockphoto-1493725196-640_adpp_is.mp4',
    ], []);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % videos.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [videos.length]);

    return (
        <div className="absolute inset-0">
            {videos.map((src, i) => (
                <video
                    key={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
                    poster="/images/hero-poster.jpg"
                >
                    <source src={src} type="video/mp4" />
                </video>
            ))}
        </div>
    );
}

function TestimonialCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
                <motion.div
                    className="flex"
                    animate={{ x: `-${current * 100}%` }}
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
                        onClick={() => setCurrent(i)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-luxury-gold' : 'w-2.5 bg-luxury-gold/30 hover:bg-luxury-gold/60'}`}
                        aria-label={`Go to testimonial ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }

        setStatus('loading');
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setStatus('success');
            setMessage('Welcome! Check your inbox for your 10% off code.');
            setEmail('');
        } catch {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <section className="section-padding bg-primary relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="section-shell relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <FadeInSection>
                        <Badge variant="gold" className="mb-4">Newsletter</Badge>
                        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight mb-4">
                            Stay Updated
                        </h2>
                        <p className="text-white/70 text-base md:text-lg mb-8">
                            Get 10% off your first order when you subscribe to our newsletter.
                        </p>
                    </FadeInSection>

                    <FadeInSection delay={0.15}>
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 rounded-full border border-white/20 bg-white/10 px-6 py-4 text-sm text-white placeholder-white/60 outline-none backdrop-blur-md focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="btn-gold px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:scale-105 transition duration-300 disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>

                        {message && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-4 text-sm ${status === 'success' ? 'text-green-300' : 'text-red-300'}`}
                            >
                                {message}
                            </motion.p>
                        )}
                    </FadeInSection>
                </div>
            </div>
        </section>
    );
}

function InstagramFeed() {
    return (
        <section className="section-padding bg-background">
            <div className="section-shell">
                <FadeInSection className="mb-12 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-3">@tuhfinacreation</p>
                    <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Follow Our Journey</h2>
                </FadeInSection>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {instagramPosts.map((src, i) => (
                        <FadeInSection key={src} delay={i * 0.08}>
                            <motion.a
                                href="https://instagram.com/tuhfinacreation"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative aspect-square overflow-hidden rounded-2xl"
                                whileHover={{ y: -4 }}
                            >
                                <Image src={src} alt={`Instagram post ${i + 1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                                    <Instagram size={28} className="text-white" />
                                </div>
                            </motion.a>
                        </FadeInSection>
                    ))}
                </div>

                <FadeInSection className="mt-10 flex flex-wrap justify-center gap-4">
                    {socialLinks.map((social) => {
                        const Icon = social.icon;
                        return (
                            <motion.a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-text-secondary shadow-soft transition hover:border-luxury-gold hover:text-luxury-gold"
                                whileHover={{ y: -2 }}
                            >
                                <Icon size={18} />
                                {social.name}
                            </motion.a>
                        );
                    })}
                </FadeInSection>
            </div>
        </section>
    );
}

function PromoBanners() {
    const banners = [
        {
            image: '/photos/nacklace.jpg',
            title: 'Luxury Jewellery Collection',
            subtitle: 'Discover timeless elegance',
            cta: 'Shop Now',
            href: '/shop',
        },
        {
            image: '/photos/wedding_ring.jpg',
            title: 'Wedding Collection',
            subtitle: 'Bridal treasures for your special day',
            cta: 'Explore',
            href: '/shop',
        },
        {
            image: '/photos/ring.jpg',
            title: 'Flat 20% Off',
            subtitle: 'Limited time offer on selected items',
            cta: 'Grab Deal',
            href: '/shop',
        },
    ];

    return (
        <div className="space-y-8">
            {banners.map((banner, i) => (
                <FadeInSection key={banner.title} delay={i * 0.1}>
                    <motion.div
                        className="relative h-64 md:h-80 overflow-hidden rounded-[28px]"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Image src={banner.image} alt={banner.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                        <div className="absolute inset-0 flex items-center">
                            <div className="section-shell relative z-10">
                                <div className="max-w-xl">
                                    <h3 className="text-2xl md:text-4xl font-serif font-bold text-white mb-3">{banner.title}</h3>
                                    <p className="text-white/80 text-sm md:text-base mb-6">{banner.subtitle}</p>
                                    <Link href={banner.href} className="btn-gold px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:scale-105 transition duration-300">
                                        {banner.cta}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </FadeInSection>
            ))}
        </div>
    );
}

export default function HomeClient({ products, categories, settings, festivalConfig, categoryOffers }: HomeClientProps) {
    const isSaleActive = settings.isSaleActive;
    const saleMessage = settings.saleMessage || 'Festival Special Sale is LIVE!';
    const { toast } = useToast();

    const displayCategories = categories.length > 0 ? categories : [
        { name: 'Rings', image: '', description: 'Handcrafted luxury band rings.' },
        { name: 'Earrings', image: '', description: 'Timeless drops and statement studs.' },
        { name: 'Necklaces', image: '', description: 'Elegant chains and gold pendants.' },
        { name: 'Bracelets', image: '', description: 'Delicate wrists wear luxury cuffs.' },
    ];

    const newArrivals = useMemo(() => [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4), [products]);
    const bestSellers = useMemo(() => products.filter((p) => p.festivalOffer || p.isCustomizable).slice(0, 4), [products]);
    const trendingProducts = useMemo(() => products.slice(0, 8), [products]);

    return (
        <div className="bg-background overflow-x-hidden">

            {festivalConfig && <SaleBanner config={festivalConfig} />}

            {!festivalConfig?.active && isSaleActive && (
                <div className="border-b border-border bg-primary px-4 py-3 text-center text-sm text-white">
                    <div className="section-shell flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <span className="flex items-center gap-2 font-medium">
                            <Sparkles size={14} className="text-luxury-gold" />
                            {saleMessage}
                        </span>
                        <Link href="/shop" className="rounded-full bg-white px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:bg-luxury-cream transition duration-300">
                            Shop Now
                        </Link>
                    </div>
                </div>
            )}

            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <HeroVideoSlider />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                </div>

                <div className="section-shell relative z-10 px-4 sm:px-6 lg:px-10 xl:px-16 py-24 text-center">
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
                            <Gem size={14} className="text-luxury-gold" />
                            100% Handcrafted
                        </motion.div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.05] tracking-tight">
                            Handcrafted with{' '}
                            <span className="luxury-text-gradient">Love</span>
                        </h1>

                        <p className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl text-white/75 leading-relaxed font-light">
                            Elevate your style with sculptural jewellery and artisan gifts designed for modern romance, celebration, and everyday glamour.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/shop" className="btn-gold px-10 py-4 text-sm uppercase font-bold tracking-wider rounded-full hover:scale-105 transition duration-300">
                                Explore Collection
                            </Link>
                            <Link href="/about" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-10 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/50">
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

            <section className="relative bg-luxury-black py-10 border-b border-white/5">
                <div className="section-shell px-4 sm:px-6 lg:px-10 xl:px-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                        {stats.map((stat, i) => (
                            <StatItem key={stat.label} stat={stat} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-padding bg-luxury-warm/20 border-y border-border">
                <div className="section-shell">
                    <FadeInSection className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold">Browse by Style</p>
                            <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Our Collections</h2>
                        </div>
                        <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-luxury-gold transition duration-300 inline-flex items-center gap-1.5">
                            View all <ArrowRight size={14} />
                        </Link>
                    </FadeInSection>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[280px]">
                        {displayCategories.slice(0, 4).map((cat, i) => (
                            <FadeInSection
                                key={cat.name}
                                delay={i * 0.1}
                                className={i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}
                            >
                                <div className="group relative h-full rounded-[28px] overflow-hidden border border-border bg-surface transition-all duration-500 hover:shadow-[0_28px_70px_rgba(17,17,17,0.14)] hover:border-luxury-gold/20">
                                    {cat.image ? (
                                        <div className="absolute inset-0 img-zoom">
                                            <Image
                                                src={cat.image}
                                                alt={cat.name}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 via-luxury-cream/40 to-accent/10 flex items-center justify-center">
                                            <span className="text-7xl font-serif font-bold text-luxury-gold/30 select-none">
                                                {cat.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="absolute bottom-0 left-0 right-0 p-7 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold mb-1">{displayCategories.length} items</p>
                                        <h3 className="text-xl font-serif font-bold text-white">{cat.name}</h3>
                                        {cat.description && (
                                            <p className="text-sm text-white/70 mt-1">{cat.description}</p>
                                        )}
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-7 bg-gradient-to-t from-black/50 to-transparent group-hover:opacity-0 transition-opacity duration-500">
                                        <h3 className="text-lg font-serif font-bold text-white">{cat.name}</h3>
                                    </div>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {newArrivals.length > 0 && (
                <section className="section-padding">
                    <div className="section-shell">
                        <FadeInSection className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold">Just Landed</p>
                                <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">New Arrivals</h2>
                            </div>
                            <Link href="/shop?sort=newest" className="text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-luxury-gold transition duration-300 inline-flex items-center gap-1.5">
                                View all <ArrowRight size={14} />
                            </Link>
                        </FadeInSection>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {newArrivals.map((product, i) => (
                                <FadeInSection key={product.id} delay={i * 0.08}>
                                    <ProductCard product={product} categoryOffers={categoryOffers} festivalConfig={festivalConfig} />
                                </FadeInSection>
                            ))}
                        </div>
                    </div>
                </section>
            )}

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
                    <Badge variant="gold" className="mb-4">Featured Collection</Badge>
                    <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
                        Customise your luxury keepsakes
                    </h2>
                    <p className="text-white/70 text-base leading-relaxed mb-8">
                        Whether it is engraving a special date or uploading an image for customized earrings and frames, our master craftsmen bring your personal stories to life with meticulous detailing.
                    </p>
                    <Link href="/shop" className="btn-gold px-8 py-3.5 text-xs uppercase font-bold tracking-wider rounded-full hover:scale-105 transition duration-300">
                        Start Customising
                    </Link>
                </FadeInSection>
            </section>

            {bestSellers.length > 0 && (
                <section className="section-padding bg-luxury-warm/10">
                    <div className="section-shell">
                        <FadeInSection className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold">Customer Favourites</p>
                                <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Best Sellers</h2>
                            </div>
                            <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-luxury-gold transition duration-300 inline-flex items-center gap-1.5">
                                Shop best sellers <ArrowRight size={14} />
                            </Link>
                        </FadeInSection>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {bestSellers.map((product, i) => (
                                <FadeInSection key={product.id} delay={i * 0.08}>
                                    <ProductCard product={product} categoryOffers={categoryOffers} festivalConfig={festivalConfig} />
                                </FadeInSection>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <PromoBanners />

            {trendingProducts.length > 0 && (
                <section className="section-padding">
                    <div className="section-shell">
                        <FadeInSection className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold">Trending Now</p>
                                <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Timeless Favourites</h2>
                            </div>
                            <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-luxury-gold transition duration-300 inline-flex items-center gap-1.5">
                                Shop all products <ArrowRight size={14} />
                            </Link>
                        </FadeInSection>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {trendingProducts.map((product, i) => (
                                <FadeInSection key={product.id} delay={i * 0.08}>
                                    <ProductCard product={product} categoryOffers={categoryOffers} festivalConfig={festivalConfig} />
                                </FadeInSection>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="section-padding bg-luxury-warm/20 border-y border-border">
                <div className="section-shell">
                    <FadeInSection className="mb-12 text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-3">Curated For You</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Featured Categories</h2>
                    </FadeInSection>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                        {['New Arrivals', 'Best Sellers', 'Jewellery', 'Artificial Flowers', 'Customized Rings', 'Earrings', 'Necklaces', 'Bracelets', 'Gift Hampers', 'Home Decor'].map((cat, i) => {
                            const imageMap: Record<string, string> = {
                                'New Arrivals': '/photos/ring1.jpg',
                                'Best Sellers': '/photos/nacklace.jpg',
                                'Jewellery': '/photos/earing.jpg',
                                'Artificial Flowers': '/photos/earing_nacklace.jpg',
                                'Customized Rings': '/photos/wedding_ring.jpg',
                                'Earrings': '/photos/earing1.jpg',
                                'Necklaces': '/photos/naclace2.jpg',
                                'Bracelets': '/photos/bracelet1.jpg',
                                'Gift Hampers': '/photos/ring_nacklace.jpg',
                                'Home Decor': '/photos/men_bracelet.jpg',
                            };
                            return (
                                <FadeInSection key={cat} delay={i * 0.06}>
                                    <Link href={`/shop?category=${encodeURIComponent(cat)}`} className="group block h-full">
                                        <div className="relative h-48 md:h-56 overflow-hidden rounded-[22px] border border-border bg-surface transition-all duration-500 hover:shadow-premium hover:border-luxury-gold/30">
                                            <div className="absolute inset-0 img-zoom">
                                                <Image src={imageMap[cat] || '/photos/ring.jpg'} alt={cat} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 50vw, 20vw" />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                            <div className="absolute inset-x-0 bottom-0 p-5">
                                                <h3 className="font-serif text-base font-bold text-white mb-1">{cat}</h3>
                                                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-luxury-gold">
                                                    <span>Shop Now</span>
                                                    <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </FadeInSection>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="section-padding">
                <div className="section-shell">
                    <FadeInSection className="mb-12 text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-3">Why Choose Us</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Trust Signals</h2>
                    </FadeInSection>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {trustSignals.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <FadeInSection key={item.title} delay={i * 0.08}>
                                    <motion.div
                                        className="h-full rounded-[22px] border border-border bg-white p-6 text-center shadow-soft transition-all duration-300 hover:shadow-premium hover:border-luxury-gold/30 hover:-translate-y-1"
                                        whileHover={{ y: -4 }}
                                    >
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/10">
                                            <Icon size={26} />
                                        </div>
                                        <h3 className="font-serif font-bold text-primary mb-1">{item.title}</h3>
                                        <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                                    </motion.div>
                                </FadeInSection>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="section-padding bg-luxury-warm/10">
                <div className="section-shell">
                    <FadeInSection className="mb-12 text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-3">Testimonials</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">What Our Customers Say</h2>
                    </FadeInSection>

                    <TestimonialCarousel />
                </div>
            </section>

            <NewsletterSection />
            <InstagramFeed />

            {products.length > 0 && (
                <section className="section-padding">
                    <div className="section-shell">
                        <FadeInSection className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold">Trending Now</p>
                                <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Trending Products</h2>
                            </div>
                            <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-luxury-gold transition duration-300 inline-flex items-center gap-1.5">
                                View all <ArrowRight size={14} />
                            </Link>
                        </FadeInSection>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {trendingProducts.map((product, i) => (
                                <FadeInSection key={product.id} delay={i * 0.08}>
                                    <ProductCard product={product} categoryOffers={categoryOffers} festivalConfig={festivalConfig} />
                                </FadeInSection>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

function StatItem({ stat, index }: { stat: typeof stats[number]; index: number }) {
    const { count, ref } = useCountUp(stat.value, 2000);
    const Icon = stat.icon;
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex items-center gap-4 justify-center"
        >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/5 text-luxury-gold border border-luxury-gold/10">
                <Icon size={22} />
            </div>
            <div>
                <p className="text-2xl font-serif font-bold text-white">
                    {count}{stat.suffix}
                </p>
                <p className="text-xs text-white/50 uppercase tracking-wider font-medium">{stat.label}</p>
            </div>
        </motion.div>
    );
}
