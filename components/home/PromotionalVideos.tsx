'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VideoItem {
    src: string;
    poster?: string;
    title: string;
    subtitle?: string;
}

const defaultVideos: VideoItem[] = [
    { src: '/videos/crafting-process.mp4', title: 'The Art of Crafting', subtitle: 'Every piece tells a story' },
    { src: '/videos/crafting-process12.mp4', title: 'Handmade with Passion', subtitle: 'Precision in every detail' },
    { src: '/videos/istockphoto-1392221473-640_adpp_is.mp4', title: 'Luxury Redefined', subtitle: 'Timeless elegance' },
    { src: '/videos/istockphoto-1493725196-640_adpp_is.mp4', subtitle: 'Created for you', title: 'Bespoke Jewellery' },
];

interface PromotionalVideosProps {
    videos?: VideoItem[];
}

export default function PromotionalVideos({ videos = defaultVideos }: PromotionalVideosProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

    return (
        <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden bg-[#fdf8f3]">
            {/* Background Accent */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(183,110,121,0.06),_transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,175,55,0.06),_transparent_50%)]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-14"
                >
                    <Badge variant="gold" className="mb-4">Behind the Scenes</Badge>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#111] mb-4">
                        Crafted with Love
                    </h2>
                    <p className="text-sm sm:text-base text-[#666] max-w-lg mx-auto leading-relaxed">
                        Watch the artistry behind every piece — from raw materials to exquisite finished jewellery.
                    </p>
                </motion.div>

                {/* Video Grid */}
                <motion.div style={{ y }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {videos.map((video, i) => (
                        <VideoCard key={video.src} video={video} index={i} isInView={isInView} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function VideoCard({ video, index, isInView }: { video: VideoItem; index: number; isInView: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const togglePlay = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
            <motion.div
                whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.1)] border border-[#e5e5e5]/50 bg-white cursor-pointer"
                onMouseEnter={() => {
                    videoRef.current?.play();
                    setIsPlaying(true);
                }}
                onMouseLeave={() => {
                    videoRef.current?.pause();
                    setIsPlaying(false);
                }}
            >
                <video
                    ref={videoRef}
                    src={video.src}
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

                {/* Play/Pause Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                        onClick={togglePlay}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100"
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                    </motion.button>
                </div>

                {/* Mute Button */}
                <button
                    onClick={toggleMute}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        Tuhfina
                    </p>
                    <h3 className="text-lg font-serif font-bold text-white mb-0.5">{video.title}</h3>
                    {video.subtitle && (
                        <p className="text-xs text-white/60">{video.subtitle}</p>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
