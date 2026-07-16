'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowRight, Gem, Heart, ShieldCheck, Sparkles, Star, Quote, Truck, Users, BadgeCheck, Play } from 'lucide-react';
import { Product, Category, CategoryOffer, FestivalConfig } from '@/lib/types';
import ProductCard from '@/components/cards/ProductCard';
import CategoryCard from '@/components/cards/CategoryCard';
import SaleBanner from '@/components/SaleBanner';
import { Badge } from '@/components/ui/badge';

interface HomeClientProps {
    products: Product[];
    categories: Category[];
    settings: any;
    festivalConfig: FestivalConfig | null;
    categoryOffers: CategoryOffer[];
}

const featuredCollections = [
    { title: 'Wedding Collection', description: 'Celebrate forever with heirloom-inspired elegance.', image: '/images/hero-1.jpg' },
    { title: 'Minimal Collection', description: 'Soft sculptural silhouettes for every day.', image: '/images/hero-2.jpg' },
    { title: 'Gift Collection', description: 'Thoughtfully wrapped pieces for life\'s sweetest moments.', image: '/images/hero-3.jpg' },
];

const testimonials = [
    { name: 'Ananya Sharma', role: 'Verified Buyer', text: 'The custom earrings I ordered were breathtaking. The craftsmanship is true luxury, and the rose gold plating has a gorgeous warm sheen.', stars: 5 },
    { name: 'Vikram Malhotra', role: 'Collector', text: 'Superb quality and exceptionally quick service. The premium gift boxes made the unboxing experience feel incredibly premium.', stars: 5 },
    { name: 'Priya Patel', role: 'Bridal Client', text: 'Stunning collection! The customizable necklace was the perfect accessory for my engagement. Truly heirloom quality.', stars: 5 },
];

const stats = [
    { icon: Users, value: 500, suffix: '+', label: 'Happy Customers' },
    { icon: Gem, value: 100, suffix: '%', label: 'Handmade' },
    { icon: Truck, value: 100, suffix: '%', label: 'Free Pan-India Shipping' },
    { icon: ShieldCheck, value: 100, suffix: '%', label: 'Certified Quality' },
];

const features = [
    { icon: Gem, title: 'Artisan Craftsmanship', description: 'Every piece is handcrafted by skilled artisans with decades of experience.' },
    { icon: Sparkles, title: 'Premium Materials', description: 'Only the finest gold-plated metals, genuine stones, and lasting finishes.' },
    { icon: Heart, title: 'Bespoke Gifting', description: 'Personalised designs that turn cherished moments into timeless keepsakes.' },
    { icon: BadgeCheck, title: 'Certified Quality', description: 'Each creation comes with a quality certificate and premium gift packaging.' },
];

const storyBlocks = [
    {
        title: 'Rooted in Tradition',
        text: 'Our journey began with a deep reverence for India\'s rich artisan heritage. Each piece we create carries forward centuries-old techniques, reimagined for the modern connoisseur. From the hands of master craftsmen to your cherished collection.',
        image: '/images/story-1.jpg',
    },
    {
        title: 'Designed for You',
        text: 'We believe luxury should be personal. That\'s why every Tuhfina creation offers bespoke customization — from engraving meaningful dates to crafting one-of-a-kind designs that tell your unique story. Because your jewelry should be as individual as you are.',
        image: '/images/story-2.jpg',
    },
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

export default function HomeClient({ products, categories, settings, festivalConfig, categoryOffers }: HomeClientProps) {
    const isSaleActive = settings.isSaleActive;
    const saleMessage = settings.saleMessage || 'Festival Special Sale is LIVE!';

    const displayCategories = categories.length > 0 ? categories : [
        { name: 'Rings', image: '', description: 'Handcrafted luxury band rings.' },
        { name: 'Earrings', image: '', description: 'Timeless drops and statement studs.' },
        { name: 'Necklaces', image: '', description: 'Elegant chains and gold pendants.' },
        { name: 'Bracelets', image: '', description: 'Delicate wrists wear luxury cuffs.' },
    ];

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

            {/* ─── Hero Section with Video Background ─── */}
            <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
                {/* Video Background */}
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 h-full w-full object-cover"
                        poster="/images/hero-poster.jpg"
                    >
                        <source src="/videos/crafting-process.mp4" type="video/mp4" />
                    </video>
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                </div>

                {/* Content */}
                <div className="section-shell relative z-10 px-4 sm:px-6 lg:px-10 xl:px-16 py-32 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl mx-auto"
                    >
                        {/* Badge pill */}
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

                {/* Scroll indicator */}
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

            {/* ─── Stats / Trust Strip ─── */}
            <section className="relative bg-luxury-black py-10 border-b border-white/5">
                <div className="section-shell px-4 sm:px-6 lg:px-10 xl:px-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                        {stats.map((stat, i) => (
                            <StatItem key={stat.label} stat={stat} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Features Bento Grid ─── */}
            <section className="section-padding">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">The Tuhfina Difference</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Why Choose Us</h2>
                    </FadeInSection>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feat, i) => (
                            <FadeInSection key={feat.title} delay={i * 0.1}>
                                <div className="group relative rounded-[24px] border border-border bg-surface p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(17,17,17,0.14)] hover:border-luxury-gold/20">
                                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-all duration-500 group-hover:bg-luxury-gold group-hover:text-white group-hover:scale-110 group-hover:rotate-3">
                                        <feat.icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-serif font-bold text-primary mb-2">{feat.title}</h3>
                                    <p className="text-sm leading-relaxed text-text-secondary">{feat.description}</p>
                                    <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-luxury-gold/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Categories Bento Grid ─── */}
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

                    {/* Bento asymmetric grid: first item spans 2 cols */}
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
                                        /* Elegant letter tile fallback — no emoji */
                                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 via-luxury-cream/40 to-accent/10 flex items-center justify-center">
                                            <span className="text-7xl font-serif font-bold text-luxury-gold/30 select-none">
                                                {cat.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Content sliding up on hover */}
                                    <div className="absolute bottom-0 left-0 right-0 p-7 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold mb-1">{displayCategories.length} items</p>
                                        <h3 className="text-xl font-serif font-bold text-white">{cat.name}</h3>
                                        {cat.description && (
                                            <p className="text-sm text-white/70 mt-1">{cat.description}</p>
                                        )}
                                    </div>

                                    {/* Default label (visible when not hovered) */}
                                    <div className="absolute bottom-0 left-0 right-0 p-7 bg-gradient-to-t from-black/50 to-transparent group-hover:opacity-0 transition-opacity duration-500">
                                        <h3 className="text-lg font-serif font-bold text-white">{cat.name}</h3>
                                    </div>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Trending Products ─── */}
            {products.length > 0 && (
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
                            {products.map((product, i) => (
                                <FadeInSection key={product.id} delay={i * 0.08}>
                                    <ProductCard
                                        product={product}
                                        categoryOffers={categoryOffers}
                                        festivalConfig={festivalConfig}
                                    />
                                </FadeInSection>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ─── Brand Story / Featured Products Zigzag ─── */}
            <section className="section-padding bg-luxury-warm/20 border-y border-border">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Our Craft</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">The Tuhfina Story</h2>
                    </FadeInSection>

                    {storyBlocks.map((block, i) => (
                        <FadeInSection key={block.title}>
                            <div className={`grid items-center gap-10 lg:gap-16 mb-16 last:mb-0 lg:grid-cols-2 ${i % 2 !== 0 ? 'lg:direction-rtl' : ''}`}>
                                {/* Image side */}
                                <div className={`relative ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                                    <div className="relative aspect-[4/3] rounded-[28px] overflow-hidden bg-gradient-to-br from-luxury-gold/10 to-accent/10 border border-border">
                                        {/* Placeholder gradient tile — replace with next/image when assets are ready */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-6xl font-serif font-bold text-luxury-gold/20 select-none">{block.title.charAt(0)}</span>
                                        </div>
                                    </div>
                                    {/* Decorative accent */}
                                    <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-luxury-gold/10 blur-3xl pointer-events-none" />
                                </div>

                                {/* Text side */}
                                <div className={`${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                                    <Badge variant="gold" className="mb-4">Our Heritage</Badge>
                                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-5">{block.title}</h3>
                                    <p className="text-base leading-relaxed text-text-secondary mb-8">{block.text}</p>
                                    <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-luxury-gold hover:text-luxury-darkGold transition duration-300 group/link">
                                        Shop Now
                                        <ArrowRight size={16} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </FadeInSection>
                    ))}
                </div>
            </section>

            {/* ─── Bespoke CTA Banner ─── */}
            <section className="relative overflow-hidden bg-primary py-24 text-white">
                {/* Dot pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(212,175,55,0.15),_transparent_50%)]" />

                <FadeInSection className="section-shell relative z-10 px-4 sm:px-6 lg:px-10 xl:px-16 text-center max-w-3xl">
                    <Badge variant="gold" className="mb-4">Bespoke Ordering</Badge>
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

            {/* ─── Testimonials ─── */}
            <section className="section-padding bg-background">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Testimonials</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Client Experiences</h2>
                    </FadeInSection>

                    <div className="grid gap-8 md:grid-cols-3">
                        {testimonials.map((t, i) => (
                            <FadeInSection key={i} delay={i * 0.12}>
                                <div className="card-hover rounded-[28px] border border-border bg-surface p-8 flex flex-col justify-between relative h-full">
                                    <Quote className="absolute right-6 top-6 text-luxury-gold/10 h-10 w-10" />
                                    <div>
                                        <div className="flex gap-1 text-luxury-gold mb-4">
                                            {Array.from({ length: t.stars }).map((_, idx) => (
                                                <Star key={idx} size={16} fill="#D4AF37" />
                                            ))}
                                        </div>
                                        <p className="text-sm leading-relaxed text-text-secondary italic">&ldquo;{t.text}&rdquo;</p>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-border flex items-center gap-4">
                                        {/* Avatar circle */}
                                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-luxury-gold/20 to-accent/20 flex items-center justify-center text-sm font-bold text-luxury-gold font-serif border border-luxury-gold/20">
                                            {t.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h4 className="font-serif font-bold text-primary text-sm">{t.name}</h4>
                                            <p className="text-xs text-text-secondary">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ─── Animated Stat Item ─── */
function StatItem({ stat, index }: { stat: typeof stats[number]; index: number }) {
    const { count, ref } = useCountUp(stat.value, 2000);
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
                <stat.icon size={22} />
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
