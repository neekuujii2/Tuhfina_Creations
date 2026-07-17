'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Gem, Heart, ShieldCheck, Sparkles, BadgeCheck, Quote, Star, Truck, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const testimonials = [
    { name: 'Ananya Sharma', role: 'Verified Buyer', text: 'The custom earrings I ordered were breathtaking. The craftsmanship is true luxury, and the rose gold plating has a gorgeous warm sheen.', stars: 5 },
    { name: 'Vikram Malhotra', role: 'Collector', text: 'Superb quality and exceptionally quick service. The premium gift boxes made the unboxing experience feel incredibly premium.', stars: 5 },
    { name: 'Priya Patel', role: 'Bridal Client', text: 'Stunning collection! The customizable necklace was the perfect accessory for my engagement. Truly heirloom quality.', stars: 5 },
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

const timeline = [
    { year: '2018', title: 'The Beginning', description: 'Tuhfina Creations was founded with a vision to blend traditional Indian craftsmanship with contemporary luxury design.' },
    { year: '2020', title: 'Digital Expansion', description: 'Launched our e-commerce platform to bring handcrafted luxury jewellery to homes across India.' },
    { year: '2023', title: 'Bespoke Collections', description: 'Introduced fully customizable jewellery lines, allowing customers to co-create their perfect pieces.' },
    { year: '2025', title: 'Global Reach', description: 'Expanded internationally while staying true to our roots in artisan excellence and customer delight.' },
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

export default function AboutPage() {
    return (
        <div className="bg-background overflow-x-hidden">

            {/* ─── Hero ─── */}
            <section className="relative py-24 bg-luxury-warm/20 border-b border-border">
                <div className="section-shell px-4 sm:px-6 lg:px-10 xl:px-16 text-center">
                    <FadeInSection>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">About Us</p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-primary mb-6">
                            The Tuhfina Difference
                        </h1>
                        <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-secondary leading-relaxed">
                            We are more than a jewellery house. We are storytellers, craftsmen, and curators of moments that matter.
                        </p>
                    </FadeInSection>
                </div>
            </section>

            {/* ─── Brand Story ─── */}
            <section className="section-padding">
                <div className="section-shell">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <FadeInSection>
                            <div className="relative aspect-[4/3] rounded-[28px] overflow-hidden bg-gradient-to-br from-luxury-gold/10 to-accent/10 border border-border">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-7xl font-serif font-bold text-luxury-gold/20 select-none">T</span>
                                </div>
                            </div>
                        </FadeInSection>
                        <FadeInSection delay={0.15}>
                            <Badge variant="gold" className="mb-4">Our Story</Badge>
                            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-6">Brand Story</h2>
                            <p className="text-base leading-relaxed text-text-secondary mb-6">
                                Tuhfina Creations was born from a passion for transforming life&apos;s precious moments into tangible treasures. Founded in India, our atelier combines time-honoured artisan techniques with modern design sensibilities to create jewellery that speaks to the heart.
                            </p>
                            <p className="text-base leading-relaxed text-text-secondary mb-8">
                                Every piece we create is a testament to our commitment to excellence, sustainability, and the belief that true luxury lies in the details.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-6 rounded-2xl border border-border bg-surface">
                                    <h3 className="font-serif font-bold text-primary mb-2">Mission</h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">To craft meaningful, heirloom-quality jewellery that celebrates life&apos;s most cherished milestones.</p>
                                </div>
                                <div className="p-6 rounded-2xl border border-border bg-surface">
                                    <h3 className="font-serif font-bold text-primary mb-2">Vision</h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">To become the most trusted name in bespoke luxury gifting, recognised globally for artistry and integrity.</p>
                                </div>
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* ─── The Tuhfina Difference ─── */}
            <section className="section-padding bg-luxury-warm/20 border-y border-border">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Why Choose Us</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">The Tuhfina Difference</h2>
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

            {/* ─── Our Craft ─── */}
            <section className="section-padding">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Manufacturing Process</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Our Craft</h2>
                    </FadeInSection>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Design', text: 'Our designers sketch each piece with precision, balancing tradition and modernity.' },
                            { step: '02', title: 'Craft', text: 'Master artisans handcraft every detail using techniques passed down through generations.' },
                            { step: '03', title: 'Quality', text: 'Each creation undergoes rigorous inspection to ensure flawless finishing and durability.' },
                        ].map((item, i) => (
                            <FadeInSection key={item.step} delay={i * 0.1}>
                                <div className="p-8 rounded-[24px] border border-border bg-surface text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-premium">
                                    <p className="text-4xl font-serif font-bold text-luxury-gold/20 mb-4">{item.step}</p>
                                    <h3 className="text-xl font-serif font-bold text-primary mb-3">{item.title}</h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">{item.text}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Testimonials ─── */}
            <section className="section-padding bg-luxury-warm/20 border-y border-border">
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

            {/* ─── Timeline ─── */}
            <section className="section-padding">
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
                                        <div className="absolute left-4 md:left-1/2 top-6 w-3 h-3 rounded-full bg-luxury-gold border-2 border-white md:-translate-x-1.5" />
                                    </div>
                                </FadeInSection>
                            ))}
                        </div>
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
                        Experience the Tuhfina Difference
                    </h2>
                    <p className="text-white/70 text-base leading-relaxed mb-8">
                        Discover collections that celebrate craftsmanship, luxury, and your unique story.
                    </p>
                    <Link href="/shop" className="btn-gold px-8 py-3.5 text-xs uppercase font-bold tracking-wider rounded-full hover:scale-105 transition duration-300">
                        Shop Collection
                    </Link>
                </FadeInSection>
            </section>
        </div>
    );
}
