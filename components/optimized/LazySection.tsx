'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface LazySectionProps {
    children: ReactNode;
    className?: string;
    placeholder?: ReactNode;
    rootMargin?: string;
}

export default function LazySection({ children, className = '', placeholder, rootMargin = '200px' }: LazySectionProps) {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [rootMargin]);

    return (
        <div ref={ref} className={className}>
            {isInView ? children : (placeholder || <div className="animate-pulse bg-surface rounded-[28px] h-64 w-full" />)}
        </div>
    );
}
