'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
    const { user, signOut, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="/logo.jpg" alt="Tuhfina Creation Logo" width={40} height={40} className="rounded-full object-cover" />
                        <h1 className="text-2xl md:text-3xl font-serif font-bold luxury-text-gradient">
                            Tuhfina Creation
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-luxury-gray hover:text-luxury-gold transition-colors font-medium"
                        >
                            Home
                        </Link>
                        <Link
                            href="/shop"
                            className="text-luxury-gray hover:text-luxury-gold transition-colors font-medium"
                        >
                            Shop
                        </Link>

                        {user && (
                            <>
                                {isAdmin ? (
                                    <Link
                                        href="/admin"
                                        className="flex items-center space-x-1 text-luxury-gray hover:text-luxury-gold transition-colors font-medium"
                                    >
                                        <LayoutDashboard size={18} />
                                        <span>Admin</span>
                                    </Link>
                                ) : (
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center space-x-1 text-luxury-gray hover:text-luxury-gold transition-colors font-medium"
                                    >
                                        <User size={18} />
                                        <span>Dashboard</span>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right Side - Cart & Auth */}
                    <div className="flex items-center space-x-4">
                        <Link href="/cart" className="relative">
                            <ShoppingCart
                                size={24}
                                className="text-luxury-gray hover:text-luxury-gold transition-colors cursor-pointer"
                            />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-luxury-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="hidden md:flex items-center space-x-4">
                                <span className="text-sm text-luxury-gray">{user.email}</span>
                                <button
                                    onClick={() => signOut()}
                                    className="flex items-center space-x-1 text-luxury-gray hover:text-luxury-gold transition-colors"
                                >
                                    <LogOut size={18} />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="hidden md:block btn-luxury text-sm">
                                Login
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-luxury-gray hover:text-luxury-gold"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4 space-y-3">
                        <Link
                            href="/"
                            className="block py-2 text-luxury-gray hover:text-luxury-gold transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/shop"
                            className="block py-2 text-luxury-gray hover:text-luxury-gold transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Shop
                        </Link>

                        {user ? (
                            <>
                                {isAdmin ? (
                                    <Link
                                        href="/admin"
                                        className="block py-2 text-luxury-gray hover:text-luxury-gold transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Admin Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href="/dashboard"
                                        className="block py-2 text-luxury-gray hover:text-luxury-gold transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        signOut();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left py-2 text-luxury-gray hover:text-luxury-gold transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="block py-2 text-luxury-gold font-semibold"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
