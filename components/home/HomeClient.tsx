'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Gem, Heart, ShieldCheck, Sparkles, Star, Quote } from 'lucide-react';
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
    { title: 'Gift Collection', description: 'Thoughtfully wrapped pieces for life’s sweetest moments.', image: '/images/hero-3.jpg' },
];

const testimonials = [
    { name: 'Ananya Sharma', role: 'Verified Buyer', text: 'The custom earrings I ordered were breathtaking. The craftsmanship is true luxury, and the rose gold plating has a gorgeous warm sheen.', stars: 5 },
    { name: 'Vikram Malhotra', role: 'Collector', text: 'Superb quality and exceptionally quick service. The premium gift boxes made the unboxing experience feel incredibly premium.', stars: 5 },
    { name: 'Priya Patel', role: 'Bridal Client', text: 'Stunning collection! The customizable necklace was the perfect accessory for my engagement. Truly heirloom quality.', stars: 5 },
];

export default function HomeClient({ products, categories, settings, festivalConfig, categoryOffers }: HomeClientProps) {
    const isSaleActive = settings.isSaleActive;
    const saleMessage = settings.saleMessage || 'Festival Special Sale is LIVE!';

    // Fallback categories if none exist in DB
    const displayCategories = categories.length > 0 ? categories : [
        { name: 'Rings', image: '', description: 'Handcrafted luxury band rings.' },
        { name: 'Earrings', image: '', description: 'Timeless drops and statement studs.' },
        { name: 'Necklaces', image: '', description: 'Elegant chains and gold pendants.' },
        { name: 'Bracelets', image: '', description: 'Delicate wrists wear luxury cuffs.' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="bg-background overflow-x-hidden">
            {festivalConfig && <SaleBanner config={festivalConfig} />}

            {!festivalConfig?.active && isSaleActive && (
                <div className="border-b border-border bg-primary px-4 py-3 text-center text-sm text-white">
                    <div className="section-shell flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <span className="flex items-center gap-2 font-medium">
                            <Sparkles size={14} className="text-[#d4af37]" />
                            {saleMessage}
                        </span>
                        <Link href="/shop" className="rounded-full bg-white px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:bg-accent transition duration-300">
                            Shop Now
                        </Link>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(183,110,121,0.12),_transparent_45%),linear-gradient(135deg,_#fdf8f3_0%,_#f7efe8_100%)] px-4 py-28 sm:px-6 lg:px-10 xl:px-16 border-b border-border">
                <div className="section-shell grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-2xl"
                    >
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white/70 px-4.5 py-2 text-xs font-bold uppercase tracking-wider text-accent shadow-soft backdrop-blur-md">
                            <Gem size={14} className="text-accent" />
                            Luxury jewellery, thoughtfully curated
                        </div>
                        <h1 className="text-balance text-4xl leading-[1.1] text-primary sm:text-5xl lg:text-6xl font-serif">
                            Discover timeless pieces for every cherished moment.
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary">
                            Elevate your style with sculptural jewellery and handcrafted gifts designed for modern romance, celebration, and everyday glamour.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link href="/shop" className="btn-luxury">
                                Explore Jewellery
                            </Link>
                            <Link href="/about" className="btn-outline-luxury">
                                Our Story
                            </Link>
                        </div>
                        <div className="mt-10 flex flex-wrap gap-6 text-xs font-bold uppercase tracking-wider text-text-secondary">
                            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-accent" /> Premium craftsmanship</span>
                            <span className="flex items-center gap-2"><Heart size={16} className="text-accent" /> Bespoke gifting support</span>
                        </div>
                    </motion.div>

                    {/* Interactive Floating Hero Cards */}
                    <div className="relative min-h-[440px] hidden sm:block">
                        <motion.div 
                            initial={{ opacity: 0, rotate: -25, scale: 0.8 }}
                            animate={{ opacity: 1, rotate: -12, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute left-6 top-6 h-52 w-44 rounded-[32px] border border-white/60 bg-white/40 p-3 shadow-premium backdrop-blur-md"
                        >
                            <div className="h-full rounded-[24px] bg-[linear-gradient(135deg,_#f4e2d5_0%,_#caa27a_100%)] flex items-center justify-center text-white/40 font-serif text-6xl">
                                💍
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, rotate: 20, scale: 0.8 }}
                            animate={{ opacity: 1, rotate: 7, scale: 1 }}
                            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute right-4 top-0 h-68 w-56 rounded-[36px] border border-border bg-white p-3 shadow-premium"
                        >
                            <div className="flex h-full flex-col justify-end rounded-[28px] bg-gradient-to-br from-[#111111] to-[#3a332d] p-5 text-white">
                                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">New arrival</p>
                                <h2 className="mt-2 text-2xl font-serif font-bold text-white">Rose Gold Edit</h2>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute bottom-8 left-16 h-44 w-44 animate-float rounded-[32px] border border-white/80 bg-white/70 p-3 shadow-premium backdrop-blur-md"
                        >
                            <div className="flex h-full items-end justify-center rounded-[24px] bg-gradient-to-tr from-[#fffdf9] to-[#f7efe8] p-4 border border-accent/10">
                                <div className="h-20 w-20 rounded-full border-[10px] border-[#d4af37]/60 flex items-center justify-center text-3xl">
                                    ✨
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Collections */}
            <section className="section-padding">
                <div className="section-shell">
                    <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Curated Selection</p>
                            <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Featured Collections</h2>
                        </div>
                        <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-accent transition duration-300 inline-flex items-center gap-1.5">
                            View all collections <ArrowRight size={14} />
                        </Link>
                    </div>
                    
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid gap-6 md:grid-cols-3"
                    >
                        {featuredCollections.map((item, index) => (
                            <motion.div key={item.title} variants={itemVariants}>
                                <CategoryCard 
                                    name={item.title} 
                                    description={item.description} 
                                    icon={['💍', '💎', '🎁'][index]}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Trending Products */}
            {products.length > 0 && (
                <section className="section-padding bg-luxury-warm/30 border-y border-border">
                    <div className="section-shell">
                        <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Trending Now</p>
                                <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Timeless Favourites</h2>
                            </div>
                            <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-accent transition duration-300 inline-flex items-center gap-1.5">
                                Shop all products <ArrowRight size={14} />
                            </Link>
                        </div>
                        
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
                        >
                            {products.map((product) => (
                                <motion.div key={product.id} variants={itemVariants}>
                                    <ProductCard 
                                        product={product} 
                                        categoryOffers={categoryOffers} 
                                        festivalConfig={festivalConfig}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Premium Gold Banner */}
            <section className="relative overflow-hidden bg-primary py-24 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(212,175,55,0.15),_transparent_50%)]" />
                <div className="section-shell relative z-10 px-4 sm:px-6 lg:px-10 xl:px-16 text-center max-w-3xl">
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
                </div>
            </section>

            {/* Testimonials */}
            <section className="section-padding bg-background">
                <div className="section-shell">
                    <div className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-2">Testimonials</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Client Experiences</h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {testimonials.map((t, i) => (
                            <div key={i} className="luxury-card p-8 flex flex-col justify-between relative border border-border/80">
                                <Quote className="absolute right-6 top-6 text-accent/10 h-10 w-10" />
                                <div>
                                    <div className="flex gap-1 text-[#d4af37] mb-4">
                                        {Array.from({ length: t.stars }).map((_, idx) => (
                                            <Star key={idx} size={16} fill="#d4af37" />
                                        ))}
                                    </div>
                                    <p className="text-sm leading-relaxed text-text-secondary italic">&ldquo;{t.text}&rdquo;</p>
                                </div>
                                <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                                    <div>
                                        <h4 className="font-serif font-bold text-primary text-sm">{t.name}</h4>
                                        <p className="text-xs text-text-secondary">{t.role}</p>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-accent">Verified</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section-padding bg-luxury-warm/20 border-t border-border">
                <div className="section-shell">
                    <div className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-2">Why Tuhfina</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">A premium experience from first click to final gift wrap</h2>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            ['Exceptional Craftsmanship', 'Every piece is created with meticulous attention to detail and lasting quality.'],
                            ['Thoughtful Personalisation', 'Elegant custom touches that turn cherished gifts into lasting keepsakes.'],
                            ['Trusted Delivery', 'A seamless ordering experience with premium packaging and quick support.'],
                        ].map(([title, description]) => (
                            <div key={title} className="luxury-card p-8 hover:border-accent/30 duration-300">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                                    <Star size={20} />
                                </div>
                                <h3 className="text-lg font-serif font-bold text-primary">{title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
