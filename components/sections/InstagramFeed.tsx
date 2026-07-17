'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Instagram, Facebook, PinIcon, MessageCircle } from 'lucide-react';
import { FadeInSection } from './shared/FadeInSection';

const instagramImages = [
    '/photos/ring.jpg',
    '/photos/necklace.jpg',
    '/photos/earing.jpg',
    '/photos/bracelet.jpg',
    '/photos/wedding_ring.jpg',
    '/photos/ring_nacklace.jpg',
];

const socials = [
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/tuhfinacreations' },
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/tuhfinacreations' },
    { icon: PinIcon, label: 'Pinterest', href: 'https://pinterest.com/tuhfinacreations' },
    { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/919999999999' },
];

export default function InstagramFeed() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section className="section-padding bg-background">
            <div className="section-shell">
                <FadeInSection className="mb-12 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold">@tuhfinacreations</p>
                    <h2 className="mt-3 text-3xl font-serif font-bold text-primary sm:text-4xl">Follow Our Story</h2>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
                        Tag us in your favourite moments. Discover daily inspiration, behind-the-scenes craft, and real looks from our community.
                    </p>
                </FadeInSection>

                <div
                    ref={ref}
                    className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
                >
                    {instagramImages.map((src, i) => (
                        <motion.a
                            key={src}
                            href="https://instagram.com/tuhfinacreations"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
                            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                            className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-luxury-gray/10"
                        >
                            <Image
                                src={src}
                                alt="Tuhfina Creation Instagram post"
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-luxury-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white">
                                    <Instagram size={22} />
                                </span>
                            </div>
                        </motion.a>
                    ))}
                </div>

                <FadeInSection delay={0.1} className="mt-12 flex flex-wrap items-center justify-center gap-4">
                    {socials.map((social) => (
                        <Link
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className="group flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-luxury-gold/40 hover:bg-luxury-gold hover:text-white"
                        >
                            <social.icon size={20} />
                        </Link>
                    ))}
                </FadeInSection>
            </div>
        </section>
    );
}
