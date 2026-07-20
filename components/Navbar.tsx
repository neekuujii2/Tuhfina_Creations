'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, User, LayoutDashboard, Menu, Search, X, Sparkles, Heart, Home, Store, Info, Phone } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { Drawer, DrawerHeader, DrawerBody } from '@/components/ui/drawer';

const quickSearches = ['Rings', 'Bracelets', 'Wedding Collection', 'Daily Wear', 'Necklaces', 'Earrings'];

type NavLink = { name: string; href: string; icon: React.ReactNode };

const desktopNavLinks: NavLink[] = [
    { name: 'Home', href: '/', icon: <Home size={16} /> },
    { name: 'Shop', href: '/shop', icon: <Store size={16} /> },
    { name: 'About', href: '/about', icon: <Info size={16} /> },
    { name: 'Contact', href: '/contact', icon: <Phone size={16} /> },
];

function useActiveState(pathname: string) {
    return (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname === href || pathname.startsWith(`${href}/`);
    };
}

export default function Navbar() {
    const { user, signOut, isAdmin } = useAuth();
    const { cartCount, isHydrated } = useCart();
    const pathname = usePathname();
    const isActive = useActiveState(pathname);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [announcementIndex, setAnnouncementIndex] = useState(0);

    const announcements = [
        'Free shipping on orders above ₹999',
        'New bridal collection now available',
        'Bespoke customisation available — create your own design',
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [announcements.length]);

    const isHome = pathname === '/';
    const isTransparent = false;

    const filteredSuggestions = useMemo(() => {
        const query = searchValue.toLowerCase().trim();
        if (!query) return quickSearches;
        return quickSearches.filter((item) => item.toLowerCase().includes(query));
    }, [searchValue]);

    return (
        <>
            {/* Announcement Bar */}
            <div
                className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
                    isTransparent
                        ? 'bg-black/30 backdrop-blur-sm'
                        : 'bg-[#111111]'
                }`}
            >
                <div className="mx-auto flex h-8 max-w-7xl items-center justify-center px-4">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={announcementIndex}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.4 }}
                            className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-white/90"
                        >
                            <Sparkles size={11} className="text-[#d4af37]" />
                            {announcements[announcementIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>

            {/* Main Nav */}
            <header
                className={`fixed inset-x-0 z-50 transition-all duration-500 ease-out`}
                style={{ top: '32px' }}
            >
                <nav
                    className={`transition-all duration-500 ease-out ${
                        isTransparent
                            ? 'bg-transparent'
                            : 'bg-white/95 backdrop-blur-2xl shadow-[0_1px_20px_rgba(0,0,0,0.06)] border-b border-black/[0.04]'
                    }`}
                >
                    <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 shrink-0">
                            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/20 bg-white/10 shadow-sm">
                                <Image
                                    src="/logo.png"
                                    alt="Tuhfina Creation"
                                    fill
                                    className="object-cover"
                                    sizes="36px"
                                />
                            </div>
                            <div className="hidden sm:block">
                                <p className={`text-[9px] font-bold uppercase tracking-[0.35em] transition-colors duration-500 ${isTransparent ? 'text-white/50' : 'text-[#111111]/40'}`}>
                                    Luxury
                                </p>
                                <h1 className={`text-sm font-serif font-bold tracking-wider leading-tight transition-colors duration-500 ${isTransparent ? 'text-white' : 'text-[#111111]'}`}>
                                    Tuhfina Creation
                                </h1>
                            </div>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden items-center gap-1 md:flex">
                            {desktopNavLinks.map((link) => {
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`relative px-4 py-2 text-[13px] font-semibold tracking-wide transition-all duration-300 rounded-full ${
                                            active
                                                ? isTransparent
                                                    ? 'text-white bg-white/15'
                                                    : 'text-[#b76e79] bg-[#b76e79]/8'
                                                : isTransparent
                                                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                                                    : 'text-[#111111]/60 hover:text-[#111111] hover:bg-black/[0.03]'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}

                            {/* Admin/Dashboard */}
                            {user && (
                                isAdmin ? (
                                    <Link
                                        href="/admin"
                                        className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold tracking-wide rounded-full transition-all duration-300 ${
                                            isActive('/admin')
                                                ? isTransparent ? 'text-white bg-white/15' : 'text-[#b76e79] bg-[#b76e79]/8'
                                                : isTransparent ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-[#111111]/60 hover:text-[#111111] hover:bg-black/[0.03]'
                                        }`}
                                    >
                                        <LayoutDashboard size={15} />
                                        Admin
                                    </Link>
                                ) : (
                                    <Link
                                        href="/dashboard"
                                        className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold tracking-wide rounded-full transition-all duration-300 ${
                                            isActive('/dashboard')
                                                ? isTransparent ? 'text-white bg-white/15' : 'text-[#b76e79] bg-[#b76e79]/8'
                                                : isTransparent ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-[#111111]/60 hover:text-[#111111] hover:bg-black/[0.03]'
                                        }`}
                                    >
                                        <User size={15} />
                                        Dashboard
                                    </Link>
                                )
                            )}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-1">
                            {/* Search */}
                            <button
                                onClick={() => setSearchOpen(true)}
                                className={`relative inline-flex items-center justify-center rounded-full p-2.5 transition-all duration-300 ${
                                    isTransparent
                                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                                        : 'text-[#111111]/50 hover:text-[#111111] hover:bg-black/[0.03]'
                                }`}
                                aria-label="Search"
                            >
                                <Search size={18} strokeWidth={2} />
                            </button>

                            {/* Wishlist */}
                            <Link
                                href="/dashboard"
                                className={`relative inline-flex items-center justify-center rounded-full p-2.5 transition-all duration-300 ${
                                    isTransparent
                                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                                        : 'text-[#111111]/50 hover:text-[#111111] hover:bg-black/[0.03]'
                                }`}
                                aria-label="Wishlist"
                            >
                                <Heart size={18} strokeWidth={2} />
                            </Link>

                            {/* Cart */}
                            <Link
                                href="/cart"
                                className={`relative inline-flex items-center justify-center rounded-full p-2.5 transition-all duration-300 ${
                                    isTransparent
                                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                                        : 'text-[#111111]/50 hover:text-[#111111] hover:bg-black/[0.03]'
                                }`}
                                aria-label="Cart"
                            >
                                <ShoppingCart size={18} strokeWidth={2} />
                                {isHydrated && cartCount > 0 && (
                                    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#b76e79] px-1 text-[10px] font-bold text-white shadow-[0_2px_8px_rgba(183,110,121,0.5)] animate-scale-in z-10">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Login/Logout */}
                            {user ? (
                                <button
                                    onClick={() => signOut()}
                                    className={`hidden rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 md:inline-flex ${
                                        isTransparent
                                            ? 'text-white/80 border border-white/20 hover:bg-white/10 hover:text-white'
                                            : 'text-[#111111]/60 border border-black/[0.06] hover:border-[#b76e79]/30 hover:text-[#b76e79]'
                                    }`}
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className={`hidden rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 md:inline-flex ${
                                        isTransparent
                                            ? 'bg-white text-[#111111] hover:bg-white/90 shadow-lg'
                                            : 'bg-[#111111] text-white hover:bg-[#111111]/90 shadow-lg'
                                    }`}
                                >
                                    Login
                                </Link>
                            )}

                            {/* Mobile Menu */}
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className={`inline-flex items-center justify-center rounded-full p-2.5 md:hidden transition-all duration-300 ${
                                    isTransparent
                                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                                        : 'text-[#111111]/50 hover:text-[#111111] hover:bg-black/[0.03]'
                                }`}
                                aria-label="Menu"
                            >
                                <Menu size={20} />
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Drawer */}
            <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} side="right">
                <DrawerHeader onClose={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center gap-2.5">
                        <div className="relative h-9 w-9 overflow-hidden rounded-full">
                            <Image src="/logo.png" alt="Tuhfina Creation" fill className="object-cover" sizes="36px" />
                        </div>
                        <span className="font-serif font-bold text-[#111111]">Tuhfina Creation</span>
                    </div>
                </DrawerHeader>

                <DrawerBody className="flex flex-col justify-between py-6">
                    <div className="flex flex-col gap-1">
                        {desktopNavLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold transition duration-200 ${
                                    isActive(link.href)
                                        ? 'bg-[#b76e79]/8 text-[#b76e79]'
                                        : 'text-[#111111] hover:bg-black/[0.03] hover:text-[#b76e79]'
                                }`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}

                        {user && (
                            isAdmin ? (
                                <Link
                                    href="/admin"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold text-[#111111] hover:bg-[#b76e79]/8 hover:text-[#b76e79] transition duration-200"
                                >
                                    <LayoutDashboard size={16} />
                                    Admin Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold text-[#111111] hover:bg-[#b76e79]/8 hover:text-[#b76e79] transition duration-200"
                                >
                                    <User size={16} />
                                    My Dashboard
                                </Link>
                            )
                        )}
                    </div>

                    <div className="flex flex-col gap-3 pt-6 border-t border-black/[0.06]">
                        {user ? (
                            <button
                                onClick={() => { signOut(); setMobileMenuOpen(false); }}
                                className="w-full rounded-full bg-[#111111] px-6 py-3.5 text-[12px] font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#111111]/90"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <button className="w-full rounded-full bg-[#111111] px-6 py-3.5 text-[12px] font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#111111]/90">
                                    Sign In
                                </button>
                            </Link>
                        )}
                    </div>
                </DrawerBody>
            </Drawer>

            {/* Search Overlay */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] flex items-start justify-center bg-black/50 px-4 pt-[120px] backdrop-blur-sm"
                        onClick={() => setSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.98 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full max-w-xl rounded-[20px] border border-black/[0.06] bg-white p-5 shadow-[0_32px_90px_rgba(0,0,0,0.2)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#b76e79]">Search</p>
                                <button
                                    onClick={() => setSearchOpen(false)}
                                    className="rounded-full p-1.5 text-[#111111]/40 hover:bg-black/[0.04] hover:text-[#111111] transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 rounded-full border border-black/[0.08] bg-[#f9f9f9] px-4 py-3">
                                <Search size={16} className="text-[#b76e79]" />
                                <input
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Search rings, bracelets, gifts..."
                                    className="w-full bg-transparent text-sm outline-none text-[#111111] placeholder:text-[#111111]/30"
                                    autoFocus
                                />
                            </div>

                            <div className="mt-4">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#111111]/40 mb-2.5">Quick</p>
                                <div className="flex flex-wrap gap-2">
                                    {filteredSuggestions.map((item) => (
                                        <Link
                                            key={item}
                                            href={`/shop?category=${encodeURIComponent(item)}`}
                                            onClick={() => setSearchOpen(false)}
                                            className="rounded-full border border-black/[0.06] bg-[#f9f9f9] px-4 py-2 text-[13px] font-medium text-[#111111]/70 transition hover:border-[#b76e79]/30 hover:text-[#b76e79]"
                                        >
                                            {item}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
