'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface VideoBackgroundProps {
    videoSrc: string;
    poster?: string;
    overlayClassName?: string;
    className?: string;
}

export default function VideoBackground({ videoSrc, poster, overlayClassName = 'bg-black/40', className = '' }: VideoBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile) {
            setIsInView(false);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => observer.disconnect();
    }, [isMobile]);

    return (
        <div className={`relative ${className}`}>
            {!isMobile && isInView && (
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                    poster={poster}
                >
                    <source src={videoSrc} type="video/mp4" />
                </video>
            )}
            {(!isMobile && !isInView) && poster && (
                <Image src={poster} alt="" fill className="object-cover" />
            )}
            {isMobile && poster && (
                <Image src={poster} alt="" fill className="object-cover" />
            )}
            <div className={`absolute inset-0 ${overlayClassName}`} />
        </div>
    );
}
