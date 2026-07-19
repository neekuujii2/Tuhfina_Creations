'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import {
    Package,
    ShoppingBag,
    LayoutDashboard,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronLeft,
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import { Button } from '@/components/ui/button';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products Catalog', icon: Package },
    { href: '/admin/orders', label: 'Orders Panel', icon: ShoppingBag },
    { href: '/admin/categories', label: 'Categories', icon: LayoutDashboard },
    { href: '/admin/settings', label: 'Special Engines', icon: Settings },
] as const;

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAdmin, loading: authLoading, signOut } = useAuth();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" />
            </div>
        );
    }

    if (!user || !isAdmin) {
        return null;
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

    return (
        <div className="bg-background min-h-screen flex">
            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar Navigation */}
            <aside
                className={`fixed lg:static z-50 h-full lg:h-screen bg-primary text-white flex flex-col justify-between shrink-0 border-r border-white/10 transition-all duration-300 ease-in-out ${
                    collapsed ? 'w-20' : 'w-68'
                } ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Brand Header */}
                    <div className={`p-4 border-b border-white/10 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 overflow-hidden flex-shrink-0">
                            <Image src="/logo.jpg" alt="Logo" width={36} height={36} className="object-cover rounded-full" />
                        </div>
                        {!collapsed && (
                            <div className="min-w-0">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent block">Manager</span>
                                <span className="font-serif font-bold text-sm tracking-wider truncate block">Tuhfina Control</span>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`ml-auto text-white/70 hover:text-white transition ${collapsed ? 'hidden' : ''}`}
                            onClick={() => setCollapsed(!collapsed)}
                            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {collapsed ? <ChevronLeft size={18} /> : <X size={18} />}
                        </Button>
                    </div>

                    {/* Sidebar Nav Items */}
                    <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold transition ${
                                        isActive
                                            ? 'bg-accent text-white shadow-soft font-bold'
                                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                                    } ${collapsed ? 'justify-center' : ''}`}
                                    aria-current={isActive ? 'page' : undefined}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon size={18} className="flex-shrink-0" aria-hidden="true" />
                                    {!collapsed && <span className="truncate">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer Logout */}
                    <div className={`p-4 border-t border-white/10 ${collapsed ? 'flex justify-center' : ''}`}>
                        <Link
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                signOut();
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold text-white/70 hover:bg-red-900/30 hover:text-red-400 transition ${
                                collapsed ? 'justify-center' : ''
                            }`}
                        >
                            <LogOut size={18} className="flex-shrink-0" aria-hidden="true" />
                            {!collapsed && <span>Sign Out</span>}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Hamburger Button */}
            {isMobile && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="fixed top-4 left-4 z-50 lg:hidden bg-white border border-border rounded-full shadow-soft"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu size={24} className="text-primary" />
                </Button>
            )}

            {/* Main Area */}
            <main className={`flex-1 overflow-y-auto lg:ml-0 transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-68'}`}>
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border px-6 py-4 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-primary mb-1">
                                Management Portal
                            </h1>
                            <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
                                Tuhfina Control >{' '}
                                <span className="text-accent font-bold">
                                    {navItems.find((item) =>
                                        pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                                    )?.label || 'Dashboard'}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <NotificationBell />
                            <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold text-primary">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span>Admin Live</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 lg:px-8 lg:py-10">
                    {children}
                </div>
            </main>
        </div>
    );
}