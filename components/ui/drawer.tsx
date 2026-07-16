'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
    side?: 'left' | 'right';
    className?: string;
}

export function Drawer({ open, onOpenChange, children, side = 'right', className }: DrawerProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onOpenChange(false);
        };
        if (open) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [open, onOpenChange]);

    const slideVariants = {
        left: {
            initial: { x: '-100%' },
            animate: { x: 0 },
            exit: { x: '-100%' },
        },
        right: {
            initial: { x: '100%' },
            animate: { x: 0 },
            exit: { x: '100%' },
        },
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        ref={overlayRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] bg-primary/40 backdrop-blur-sm"
                        onClick={() => onOpenChange(false)}
                    />
                    <motion.div
                        initial={slideVariants[side].initial}
                        animate={slideVariants[side].animate}
                        exit={slideVariants[side].exit}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                        className={cn(
                            "fixed top-0 z-[101] flex h-full w-[85vw] max-w-md flex-col bg-background shadow-premium",
                            side === 'left' ? 'left-0 rounded-r-[28px]' : 'right-0 rounded-l-[28px]',
                            className
                        )}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

interface DrawerHeaderProps {
    children: ReactNode;
    onClose?: () => void;
    className?: string;
}

export function DrawerHeader({ children, onClose, className }: DrawerHeaderProps) {
    return (
        <div className={cn("flex items-center justify-between border-b border-border px-6 py-5", className)}>
            <div>{children}</div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="rounded-full p-2 text-text-secondary transition hover:bg-accent/10 hover:text-accent"
                    aria-label="Close drawer"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
}

export function DrawerBody({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("flex-1 overflow-y-auto px-6 py-5", className)}>
            {children}
        </div>
    );
}

export function DrawerFooter({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("border-t border-border px-6 py-5", className)}>
            {children}
        </div>
    );
}
