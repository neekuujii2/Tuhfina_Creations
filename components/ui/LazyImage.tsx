'use client';

import Image from 'next/image';
import { useState } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
}

export default function LazyImage({ src, alt, width, height, className = '', priority = false }: LazyImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-luxury-gray/10 ${className}`} style={{ width, height }}>
                <span className="text-4xl">🎁</span>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
            {isLoading && (
                <div className="absolute inset-0 animate-pulse bg-luxury-gray/10" />
            )}
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={`object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoadingComplete={() => setIsLoading(false)}
                onError={() => setError(true)}
                loading={priority ? 'eager' : 'lazy'}
                priority={priority}
            />
        </div>
    );
}
