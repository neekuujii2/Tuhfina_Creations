'use client';

import { motion, useInView, type Variants } from 'framer-motion';
import { useRef } from 'react';
import { Truck, ShieldCheck, ArrowLeftRight, Headphones, Gem, Award, Gift, Zap } from 'lucide-react';

interface TrustSignal {
    icon: typeof Truck;
    title: string;
    description: string;
}

const trustSignals: TrustSignal[] = [
    {
        icon: Truck,
        title: 'Free Shipping',
        description: 'Complimentary pan-India delivery on every order, no minimum spend required.',
    },
    {
        icon: ShieldCheck,
        title: 'Secure Payments',
        description: '100% encrypted and secure checkout with trusted payment gateways.',
    },
    {
        icon: ArrowLeftRight,
        title: 'Easy Returns',
        description: 'Hassle-free 7-day returns and exchanges on all eligible products.',
    },
    {
        icon: Headphones,
        title: '24×7 Support',
        description: 'Our luxury concierge team is available round the clock for you.',
    },
    {
        icon: Gem,
        title: 'Premium Quality',
        description: 'Handcrafted by master artisans using the finest materials available.',
    },
    {
        icon: Award,
        title: 'Certified Jewellery',
        description: 'Every piece is quality-checked and certified for lasting brilliance.',
    },
    {
        icon: Gift,
        title: 'Gift Packaging',
        description: 'Elegant signature gift wrapping included with every purchase.',
    },
    {
        icon: Zap,
        title: 'Fast Delivery',
        description: 'Express dispatch so your treasures arrive right on time.',
    },
];

const container: Variants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.08 },
    },
};

const item: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function TrustSignals() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section className="section-padding bg-luxury-warm/30 border-y border-border">
            <div className="section-shell">
                <motion.div
                    ref={ref}
                    variants={container}
                    initial="hidden"
                    animate={isInView ? 'show' : 'hidden'}
                    className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:gap-6"
                >
                    {trustSignals.map((signal) => (
                        <motion.div
                            key={signal.title}
                            variants={item}
                            whileHover={{ y: -6 }}
                            className="group glass-panel relative flex flex-col items-center text-center p-7 transition-all duration-300 hover:border-luxury-gold/30 hover:shadow-luxury"
                        >
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-luxury-gold shadow-soft transition-all duration-500 group-hover:bg-luxury-gold group-hover:text-white">
                                <signal.icon size={26} strokeWidth={1.6} />
                            </div>
                            <h3 className="font-serif text-lg font-bold text-primary">{signal.title}</h3>
                            <p className="mt-2 text-xs leading-relaxed text-text-secondary">{signal.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
