'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

const jewelleryCollections = [
    'Rings',
    'Earrings',
    'Necklaces',
    'Bracelets',
    'Mangalsutra',
    'Wedding Collection',
];

const quickSearches = ['Rings', 'Bracelets', 'Wedding Collection', 'Daily Wear'];

export default function Navbar() {
    const { user, signOut, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const updateScroll = () => setScrolled(window.scrollY > 20);
        updateScroll();
        window.addEventListener('scroll', updateScroll);
        return () => window.removeEventListener('scroll', updateScroll);
    }, []);

    const isHome = pathname === '/';
    const navClasses = isHome && !scrolled
        ? 'bg-transparent text-white border-b border-white/10'
        : 'bg-background/90 text-primary border-b border-border backdrop-blur-xl shadow-glass';

    const filteredSuggestions = useMemo(() => {
        const query = searchValue.toLowerCase().trim();
        if (!query) return quickSearches;
        return quickSearches.filter((item) => item.toLowerCase().includes(query));
    }, [searchValue]);

    return (
        <>
            <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${navClasses}`}>
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-soft overflow-hidden">
                            <Image src="/logo.jpg" alt="Tuhfina Creation logo" width={40} height={40} className="rounded-full object-cover" />
                        </div>
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${isHome && !scrolled ? 'text-white/80' : 'text-primary/70'}`}>Luxury</p>
                            <h1 className={`text-base font-serif font-bold tracking-wider ${isHome && !scrolled ? 'text-white' : 'text-primary'}`}>Tuhfina Creation</h1>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-8 md:flex">
                        <Link href="/" className={`text-sm font-semibold tracking-wide transition ${isHome && !scrolled ? 'text-white/90 hover:text-white' : 'text-text-secondary hover:text-accent'}`}>Home</Link>
                        <Link href="/shop" className={`text-sm font-semibold tracking-wide transition ${isHome && !scrolled ? 'text-white/90 hover:text-white' : 'text-text-secondary hover:text-accent'}`}>Shop</Link>
                        
                        {/* Mega Menu Dropdown Group */}
                        <div className="group relative">
                            <button className={`text-sm font-semibold tracking-wide transition inline-flex items-center gap-1 ${isHome && !scrolled ? 'text-white/90 hover:text-white' : 'text-text-secondary hover:text-accent'}`}>
                                Jewellery
                                <span className="text-[10px] opacity-60 group-hover:rotate-180 transition-transform duration-300">▼</span>
                            </button>
                            
                            {/* Mega Menu Container */}
                            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[600px] rounded-[24px] border border-border bg-white p-6 opacity-0 shadow-premium transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 z-50">
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-2">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Categories</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {jewelleryCollections.map((item) => (
                                                <Link 
                                                    key={item} 
                                                    href={`/shop?category=${encodeURIComponent(item)}`} 
                                                    className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm text-text-secondary transition hover:bg-accent/8 hover:text-accent hover:translate-x-1 duration-200"
                                                >
                                                    <span>{item}</span>
                                                    <ArrowRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-luxury-warm/80 rounded-2xl p-4 flex flex-col justify-between border border-accent/10">
                                        <div>
                                            <Badge variant="gold" size="sm" className="mb-2">New Season</Badge>
                                            <h5 className="font-serif font-bold text-primary text-base mb-1">Luxury Gift Set</h5>
                                            <p className="text-[11px] text-text-secondary leading-relaxed">Artisan handcrafted wedding collection designed for timeless beauty.</p>
                                        </div>
                                        <Link href="/shop" className="text-xs font-bold text-accent inline-flex items-center gap-1 hover:underline mt-4">
                                            Explore Now <ArrowRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="/about" className={`text-sm font-semibold tracking-wide transition ${isHome && !scrolled ? 'text-white/90 hover:text-white' : 'text-text-secondary hover:text-accent'}`}>About</Link>
                        
                        {user && (
                            isAdmin ? (
                                <Link href="/admin" className={`flex items-center gap-2 text-sm font-semibold tracking-wide transition ${isHome && !scrolled ? 'text-white/90 hover:text-white' : 'text-text-secondary hover:text-accent'}`}>
                                    <LayoutDashboard size={16} />
                                    Admin
                                </Link>
                            ) : (
                                <Link href="/dashboard" className={`flex items-center gap-2 text-sm font-semibold tracking-wide transition ${isHome && !scrolled ? 'text-white/90 hover:text-white' : 'text-text-secondary hover:text-accent'}`}>
                                    <User size={16} />
                                    Dashboard
                                </Link>
                            )
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className={`rounded-full p-2.5 transition ${isHome && !scrolled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-surface text-primary shadow-soft hover:text-accent hover:shadow-glass'}`}
                            aria-label="Open search"
                        >
                            <Search size={18} />
                        </button>
                        
                        <Link 
                            href="/cart" 
                            className={`relative rounded-full p-2.5 transition ${isHome && !scrolled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-surface text-primary shadow-soft hover:text-accent hover:shadow-glass'}`} 
                            aria-label="View cart"
                        >
                            <ShoppingCart size={18} />
                            {cartCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white shadow-glow">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        
                        {user ? (
                            <button 
                                onClick={() => signOut()} 
                                className={`hidden rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition md:inline-flex ${isHome && !scrolled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-surface text-primary shadow-soft hover:text-accent hover:shadow-glass'}`}
                            >
                                Logout
                            </button>
                        ) : (
                            <Link 
                                href="/login" 
                                className={`hidden rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition md:inline-flex ${isHome && !scrolled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-primary text-white hover:bg-accent hover:text-primary'}`}
                            >
                                Login
                            </Link>
                        )}
                        
                        <button 
                            onClick={() => setMobileMenuOpen(true)} 
                            className={`rounded-full p-2.5 md:hidden transition ${isHome && !scrolled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-surface text-primary shadow-soft'}`} 
                            aria-label="Open navigation"
                        >
                            <Menu size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Navigation */}
            <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} side="right">
                <DrawerHeader onClose={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center gap-2">
                        <Image src="/logo.jpg" alt="Tuhfina Creation logo" width={32} height={32} className="rounded-full object-cover" />
                        <span className="font-serif font-bold text-primary">Tuhfina Creation</span>
                    </div>
                </DrawerHeader>
                
                <DrawerBody className="flex flex-col justify-between py-6">
                    <div className="flex flex-col gap-2">
                        <Link 
                            href="/" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="rounded-2xl px-4 py-3 text-base font-semibold text-primary hover:bg-accent/8 hover:text-accent transition duration-200"
                        >
                            Home
                        </Link>
                        <Link 
                            href="/shop" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="rounded-2xl px-4 py-3 text-base font-semibold text-primary hover:bg-accent/8 hover:text-accent transition duration-200"
                        >
                            Shop All
                        </Link>
                        
                        <div className="rounded-3xl border border-border bg-luxury-warm/40 p-4 mt-2">
                            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
                                <Sparkles size={14} /> Jewellery
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {jewelleryCollections.map((item) => (
                                    <Link 
                                        key={item} 
                                        href={`/shop?category=${encodeURIComponent(item)}`} 
                                        onClick={() => setMobileMenuOpen(false)} 
                                        className="rounded-xl px-3 py-2 text-sm text-text-secondary hover:bg-accent/10 hover:text-accent transition duration-200"
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        
                        <Link 
                            href="/about" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="rounded-2xl px-4 py-3 text-base font-semibold text-primary hover:bg-accent/8 hover:text-accent transition duration-200"
                        >
                            About Us
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3 pt-6 border-t border-border">
                        {user ? (
                            <>
                                {isAdmin ? (
                                    <Link 
                                        href="/admin" 
                                        onClick={() => setMobileMenuOpen(false)} 
                                        className="btn-outline-luxury flex items-center gap-2"
                                    >
                                        <LayoutDashboard size={16} /> Admin Dashboard
                                    </Link>
                                ) : (
                                    <Link 
                                        href="/dashboard" 
                                        onClick={() => setMobileMenuOpen(false)} 
                                        className="btn-outline-luxury flex items-center gap-2"
                                    >
                                        <User size={16} /> Customer Dashboard
                                    </Link>
                                )}
                                <Button 
                                    variant="luxury" 
                                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                                    className="w-full"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="luxury" className="w-full">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </DrawerBody>
            </Drawer>

            {/* Premium Search Overlay */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[60] flex items-start justify-center bg-primary/40 px-4 py-16 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }} 
                            exit={{ y: 20, opacity: 0 }} 
                            className="w-full max-w-2xl rounded-[32px] border border-border bg-white p-6 shadow-premium"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Discover</p>
                                    <h2 className="text-xl font-serif font-bold text-primary">Search our premium collections</h2>
                                </div>
                                <button 
                                    onClick={() => setSearchOpen(false)} 
                                    className="rounded-full p-2 text-text-secondary hover:bg-accent/10 hover:text-accent"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-3">
                                <Search size={18} className="text-accent" />
                                <input 
                                    value={searchValue} 
                                    onChange={(e) => setSearchValue(e.target.value)} 
                                    placeholder="Search rings, bracelets, gifts..." 
                                    className="w-full bg-transparent text-sm outline-none text-primary" 
                                    autoFocus
                                />
                            </div>
                            
                            <div className="mt-6">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-3">Quick Searches</p>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {filteredSuggestions.map((item) => (
                                        <Link 
                                            key={item} 
                                            href={`/shop?category=${encodeURIComponent(item)}`} 
                                            onClick={() => setSearchOpen(false)} 
                                            className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-secondary transition hover:border-accent hover:text-accent hover:bg-white duration-200"
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

// Inline badge mock to prevent import errors in case of cyclic dependency
function Badge({ children, variant, size, className }: any) {
    const isGold = variant === 'gold';
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${isGold ? 'bg-gradient-to-r from-[#d4af37] to-[#f2d06b] text-primary' : 'bg-primary text-white'} ${className}`}>
            {children}
        </span>
    );
}
