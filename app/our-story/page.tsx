'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Gem, Heart, ShieldCheck, Sparkles, BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

export default function OurStoryPage() {
    return (
        <div className="bg-background overflow-x-hidden">

            {/* ─── Hero ─── */}
            <section className="relative py-24 bg-luxury-warm/20 border-b border-border">
                <div className="section-shell px-4 sm:px-6 lg:px-10 xl:px-16 text-center">
                    <FadeInSection>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Our Story</p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-primary mb-6">
                            A Journey of Craft & Love
                        </h1>
                        <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-secondary leading-relaxed">
                            From a small atelier to a beloved luxury house — discover the passion and people behind Tuhfina Creations.
                        </p>
                    </FadeInSection>
                </div>
            </section>

            {/* ─── Founder Story ─── */}
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

            {/* ─── Brand Values ─── */}
            <section className="section-padding bg-luxury-warm/20 border-y border-border">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Brand Values</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">What We Stand For</h2>
                    </FadeInSection>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((val, i) => (
                            <FadeInSection key={val.title} delay={i * 0.1}>
                                <div className="group relative rounded-[24px] border border-border bg-surface p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(17,17,17,0.14)] hover:border-luxury-gold/20">
                                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-all duration-500 group-hover:bg-luxury-gold group-hover:text-white group-hover:scale-110 group-hover:rotate-3">
                                        <val.icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-serif font-bold text-primary mb-2">{val.title}</h3>
                                    <p className="text-sm leading-relaxed text-text-secondary">{val.text}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Craftsmanship ─── */}
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

            {/* ─── CTA ─── */}
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
        </div>
    );
}
