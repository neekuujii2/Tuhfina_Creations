'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({
    toast: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'success', duration: number = 4000) => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const icons = {
        success: <CheckCircle size={18} className="text-success" />,
        error: <AlertCircle size={18} className="text-error" />,
        info: <Info size={18} className="text-accent" />,
    };

    const borderColors = {
        success: 'border-l-success',
        error: 'border-l-error',
        info: 'border-l-accent',
    };

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[200] flex flex-col-reverse gap-3">
                <AnimatePresence mode="popLayout">
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            layout
                            initial={{ opacity: 0, x: 80, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 80, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                            className={cn(
                                "flex min-w-[300px] max-w-md items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5 shadow-premium",
                                "border-l-4",
                                borderColors[t.type]
                            )}
                        >
                            {icons[t.type]}
                            <p className="flex-1 text-sm font-medium text-primary">{t.message}</p>
                            <button
                                onClick={() => removeToast(t.id)}
                                className="rounded-full p-1 text-text-secondary transition hover:bg-accent/10 hover:text-accent"
                                aria-label="Dismiss"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
