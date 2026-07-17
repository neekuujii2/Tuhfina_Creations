'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useMemo } from 'react';

export const dynamic = 'force-dynamic';

import { ArrowRight, Gem, Heart, ShieldCheck, Sparkles, BadgeCheck, Quote, Star, Truck, Users, Award, Clock, PackageOpen, RefreshCcw, Headphones, Phone, Mail, MapPin, Play, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const videos = [
    '/videos/crafting-process.mp4',
    '/videos/crafting-process12.mp4',
    '/videos/istockphoto-1392221473-640_adpp_is.mp4',
    '/videos/istockphoto-1493725196-640_adpp_is.mp4',
];

const photos = [
    '/photos/ring.jpg', '/photos/ring1.jpg', '/photos/nacklace.jpg', '/photos/earing.jpg',
    '/photos/bracelet.jpg', '/photos/wedding_ring.jpg', '/photos/naclace2.jpg', '/photos/earing1.jpg',
];

const testimonials = [
    { name: 'Priya Sharma', role: 'Bride', image: '/photos/earing1.jpg', rating: 5, text: 'Absolutely stunning! My wedding jewellery from Tuhfina Creation exceeded all expectations.' },
    { name: 'Ananya Reddy', role: 'Customer', image: '/photos/nacklace.jpg', rating: 5, text: 'The customization service is amazing. They created exactly what I envisioned.' },
    { name: 'Meera Kapoor', role: 'Customer', image: '/photos/ring1.jpg', rating: 5, text: 'Beautiful pieces and fast delivery. The packaging was so luxurious.' },
];

const timeline = [
    { year: '2018', title: 'Dream Started', description: 'Tuhfina Creations was founded with a vision to blend traditional Indian craftsmanship with contemporary luxury design.' },
    { year: '2019', title: 'First Collection', description: 'Launched our debut collection of handcrafted gold-plated jewellery, receiving overwhelming appreciation from early patrons.' },
    { year: '2021', title: 'Handmade Excellence', description: 'Expanded our atelier and trained over 20 master artisans, refining our techniques for precision and quality.' },
    { year: '2023', title: 'Thousands Happy', description: 'Crossed 5,000+ happy customers and introduced fully customizable jewellery lines for personal storytelling.' },
    { year: '2025', title: 'Growing Luxury Brand', description: 'Expanded internationally while staying true to our roots in artisan excellence and customer delight.' },
];

const values = [
    { icon: Gem, title: 'Artistry', text: 'We honour the artisan\'s hand in every curve, polish, and setting.' },
    { icon: Heart, title: 'Integrity', text: 'Transparent sourcing, honest pricing, and responsible craftsmanship.' },
    { icon: ShieldCheck, title: 'Legacy', text: 'Pieces built to last generations, becoming part of your family\'s story.' },
    { icon: Sparkles, title: 'Innovation', text: 'Blending tradition with modern design to create timeless yet contemporary forms.' },
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
                    {src.endsWith('.mp4') ? (
                        <video autoPlay muted loop playsInline className="h-full w-full object-cover scale-105 animate-ken-burns" poster="/images/hero-poster.jpg">
                            <source src={src} type="video/mp4" />
                        </video>
                    ) : (
                        <Image src={src} alt="" fill className="object-cover scale-105 animate-ken-burns" priority={i === 0} />
                    )}
                </motion.div>
            ))}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/50" />
        </div>
    );
}

export default function OurStoryPage() {
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
                            Our Story
                        </motion.div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.05] tracking-tight">
                            A Journey of Craft &{' '}
                            <span className="luxury-text-gradient">Love</span>
                        </h1>

                        <p className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl text-white/75 leading-relaxed font-light">
                            From a small atelier to a beloved luxury house — discover the passion and people behind Tuhfina Creations.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/about" className="btn-gold px-10 py-4 text-sm uppercase font-bold tracking-wider rounded-full hover:scale-105 transition duration-300">
                                Learn More
                            </Link>
                            <Link href="/shop" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-10 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/50">
                                Shop Collection
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

            {/* Founder Story */}
            <section className="section-padding">
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
                            <Badge variant="gold" className="mb-4">Founder Story</Badge>
                            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-6">Rooted in Passion</h2>
                            <p className="text-base leading-relaxed text-text-secondary mb-6">
                                What began as a personal quest for meaningful, handcrafted jewellery soon became a calling. Our founder spent years apprenticing with master craftspeople across India, learning the secrets of traditional metallurgy and stone setting.
                            </p>
                            <p className="text-base leading-relaxed text-text-secondary mb-8">
                                Today, that same spirit of curiosity and dedication drives every Tuhfina creation — each piece a bridge between heritage and modernity.
                            </p>
                            <Link href="/about" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-luxury-gold hover:text-luxury-darkGold transition duration-300 group/link">
                                Learn More <ArrowRight size={16} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                            </Link>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* Brand Values */}
            <section className="section-padding bg-luxury-warm/20 border-y border-border">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Brand Values</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">What We Stand For</h2>
                    </FadeInSection>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((val, i) => {
                            const Icon = val.icon;
                            return (
                                <FadeInSection key={val.title} delay={i * 0.1}>
                                    <div className="group relative h-full rounded-[24px] border border-border bg-surface p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-premium hover:border-luxury-gold/20">
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

            {/* Craftsmanship */}
            <section className="section-padding">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Craftsmanship</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Made by Hand, Treasured by Heart</h2>
                    </FadeInSection>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            { title: 'Material Selection', text: 'We source only the finest metals, stones, and finishes, ensuring each material meets our exacting standards.' },
                            { title: 'Hand Finishing', text: 'Every edge, curve, and surface is refined by hand, giving each piece its unique character and luminosity.' },
                            { title: 'Quality Assurance', text: 'Before leaving our atelier, every creation is inspected, polished, and packaged with care.' },
                            { title: 'Sustainable Practice', text: 'We minimise waste, recycle materials, and partner with ethical suppliers whenever possible.' },
                        ].map((item, i) => (
                            <FadeInSection key={item.title} delay={i * 0.1}>
                                <div className="p-8 rounded-[24px] border border-border bg-surface transition-all duration-500 hover:shadow-premium">
                                    <h3 className="text-xl font-serif font-bold text-primary mb-3">{item.title}</h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">{item.text}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="section-padding bg-luxury-warm/20 border-y border-border">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Our Journey</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Timeline</h2>
                    </FadeInSection>

                    <div className="relative">
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
                        <div className="space-y-12">
                            {timeline.map((item, i) => (
                                <FadeInSection key={item.year} delay={i * 0.1}>
                                    <div className={`relative flex flex-col md:flex-row gap-6 md:gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                        <div className="md:w-1/2 pl-12 md:pl-0">
                                            <div className="p-6 rounded-[24px] border border-border bg-surface transition-all duration-500 hover:shadow-premium">
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

            {/* Testimonials */}
            <section className="section-padding">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Testimonials</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Client Experiences</h2>
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
                        Continue the Story
                    </h2>
                    <p className="text-white/70 text-base leading-relaxed mb-8">
                        Explore our collections and find a piece that speaks to your journey.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/shop" className="btn-gold px-8 py-3.5 text-xs uppercase font-bold tracking-wider rounded-full hover:scale-105 transition duration-300">
                            Shop Now
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
