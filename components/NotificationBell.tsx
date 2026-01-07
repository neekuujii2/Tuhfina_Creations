'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Package, Check, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '@/lib/types';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const lastNotatedId = useRef<string | null>(null);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/admin/notifications');
            if (res.ok) {
                const data = await res.json();

                // Sound logic: If we have a new notification that isn't read
                if (data.notifications.length > 0) {
                    const latest = data.notifications[0];
                    if (latest._id !== lastNotatedId.current && !latest.isRead) {
                        // Only play sound if this is a fresh arrival
                        if (lastNotatedId.current !== null) {
                            const audio = new Audio('/sounds/notify.mp3');
                            audio.play().catch(e => console.log('Audio play failed:', e));
                        }
                        lastNotatedId.current = latest._id;
                    }
                } else if (lastNotatedId.current === null) {
                    // Initialize ref on first load even if empty
                    lastNotatedId.current = 'initialized';
                }

                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds for "real-time feel"
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/notifications/${id}/read`, {
                method: 'PATCH',
            });
            if (res.ok) {
                setNotifications(prev =>
                    prev.map(n => n._id === id ? { ...n, isRead: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-luxury-gray hover:text-luxury-gold transition-colors duration-200"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-luxury-cream/30">
                            <h3 className="font-serif font-bold text-luxury-black">Notifications</h3>
                            <span className="text-xs text-luxury-gray">{unreadCount} unread</span>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-luxury-gray">
                                    <BellOff className="mx-auto mb-2 opacity-20" size={32} />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`p-4 border-b border-gray-50 flex items-start space-x-3 transition-colors ${!notification.isRead ? 'bg-luxury-gold/5' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`mt-1 p-2 rounded-full ${!notification.isRead ? 'bg-luxury-gold text-white' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            <Package size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${!notification.isRead ? 'font-bold text-luxury-black' : 'text-gray-600'}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-luxury-gray mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-2">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => markAsRead(notification._id)}
                                                className="p-1 text-luxury-gold hover:bg-luxury-gold/10 rounded-full transition-colors"
                                                title="Mark as read"
                                            >
                                                <Check size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-3 text-center border-t border-gray-100">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-xs text-luxury-gold font-bold hover:underline"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
