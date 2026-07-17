'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface FadeInSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function FadeInSection({ children, className = '', delay = 0 }: FadeInSectionProps) {
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
