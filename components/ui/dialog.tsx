'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
    className?: string;
}

export function Dialog({ open, onOpenChange, children, className }: DialogProps) {
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

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    ref={overlayRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 px-4 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === overlayRef.current) onOpenChange(false);
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 12 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className={cn(
                            "relative w-full max-w-lg rounded-[28px] border border-border bg-background p-6 shadow-premium",
                            "max-h-[90vh] overflow-y-auto",
                            className
                        )}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

interface DialogHeaderProps {
    children: ReactNode;
    onClose?: () => void;
    className?: string;
}

export function DialogHeader({ children, onClose, className }: DialogHeaderProps) {
    return (
        <div className={cn("mb-5 flex items-start justify-between", className)}>
            <div>{children}</div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="rounded-full p-2 text-text-secondary transition hover:bg-accent/10 hover:text-accent"
                    aria-label="Close dialog"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
}

export function DialogTitle({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <h2 className={cn("text-xl font-semibold text-primary", className)}>
            {children}
        </h2>
    );
}

export function DialogDescription({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <p className={cn("mt-1 text-sm text-text-secondary", className)}>
            {children}
        </p>
    );
}

export function DialogFooter({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("mt-6 flex items-center justify-end gap-3", className)}>
            {children}
        </div>
    );
}
