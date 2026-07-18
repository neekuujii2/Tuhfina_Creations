'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { productService } from '@/lib/services/productService';
import { Product, CategoryOffer, FestivalConfig } from '@/lib/types';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RefreshCcw, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { resolveProductPrice } from '@/lib/saleUtils';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItemWithDetails {
    productId: string;
    quantity: number;
    product: Product;
    customization?: {
        text?: string;
        imageUrl?: string;
    };
}

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart } = useCart();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
    const [categoryOffers, setCategoryOffers] = useState<CategoryOffer[]>([]);
    const [festivalConfig, setFestivalConfig] = useState<FestivalConfig | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [categoryOffersData, festivalConfigData] = await Promise.all([
                fetch('/api/category-offers').then(res => res.json()),
                fetch('/api/festival-config').then(res => res.json()),
            ]);
            setCategoryOffers(categoryOffersData);
            setFestivalConfig(festivalConfigData);

            const itemsWithDetails: (CartItemWithDetails | null)[] = await Promise.all(
                cart.map(async (item) => {
                    const product = await productService.getProduct(item.productId);
                    if (product) {
                        return { ...item, product };
                    }
                    return null;
                })
            );
            setCartItems(itemsWithDetails.filter((item): item is CartItemWithDetails => item !== null));
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    }, [cart]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const total = cartItems.reduce(
        (sum, item) => {
            const status = resolveProductPrice(item.product, categoryOffers, festivalConfig);
            return sum + status.currentPrice * item.quantity;
        },
        0
    );

    const totalSavings = subtotal - total;

    const handleCheckout = () => {
        if (authLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }
        router.push('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdf8f3]">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative h-12 w-12">
                        <div className="absolute inset-0 rounded-full border-2 border-[#d4af37]/20" />
                        <div className="absolute inset-0 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin" />
                    </div>
                    <p className="text-sm text-[#666] font-medium">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#fdf8f3] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#f8e1e7]/50 flex items-center justify-center">
                        <ShoppingBag className="text-[#b76e79]" size={40} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-[#111] mb-3">
                        Your cart is empty
                    </h2>
                    <p className="text-[#666] mb-8 text-sm leading-relaxed">
                        Discover our exquisite collection of handcrafted jewellery and luxury gifts.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 rounded-full bg-[#111] px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#111]/90 hover:shadow-xl"
                    >
                        Explore Collection
                        <ArrowLeft size={16} className="rotate-180" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdf8f3]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111]">
                            Shopping Cart
                        </h1>
                        <p className="text-sm text-[#666] mt-1">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
                    </div>
                    <Link
                        href="/shop"
                        className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-[#666] hover:text-[#b76e79] transition-colors duration-300"
                    >
                        <ArrowLeft size={16} />
                        Continue Shopping
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {cartItems.map((item) => {
                                const status = resolveProductPrice(item.product, categoryOffers, festivalConfig);
                                return (
                                    <motion.div
                                        key={item.productId}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-2xl border border-[#e5e5e5] p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                                    >
                                        <div className="flex flex-col sm:flex-row gap-5">
                                            {/* Product Image */}
                                            <Link href={`/product/${item.productId}`} className="relative h-36 w-36 sm:h-40 sm:w-40 flex-shrink-0 rounded-xl overflow-hidden bg-[#f5f5f5] group">
                                                {item.product.images && item.product.images.length > 0 ? (
                                                    <Image
                                                        src={item.product.images[0]}
                                                        alt={item.product.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-4xl">
                                                        🎁
                                                    </div>
                                                )}
                                            </Link>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#b76e79] mb-1">
                                                            {item.product.category}
                                                        </p>
                                                        <Link href={`/product/${item.productId}`}>
                                                            <h3 className="text-lg font-serif font-semibold text-[#111] hover:text-[#b76e79] transition-colors duration-300 line-clamp-1">
                                                                {item.product.title}
                                                            </h3>
                                                        </Link>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.productId)}
                                                        className="flex-shrink-0 p-2 rounded-full text-[#999] hover:text-[#d32f2f] hover:bg-[#d32f2f]/5 transition-all duration-300"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>

                                                <p className="text-xs text-[#999] mt-1 line-clamp-1">
                                                    {item.product.description}
                                                </p>

                                                {/* Customization */}
                                                {item.customization && (
                                                    <div className="mt-3 p-3 bg-[#fdf8f3] rounded-lg border border-[#f8e1e7]">
                                                        <p className="text-xs font-semibold text-[#111] mb-1">Customization</p>
                                                        {item.customization.text && (
                                                            <p className="text-xs text-[#666]">Text: {item.customization.text}</p>
                                                        )}
                                                        {item.customization.imageUrl && (
                                                            <p className="text-xs text-[#666]">Custom image attached</p>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Quantity & Price */}
                                                <div className="flex items-end justify-between mt-4">
                                                    <div className="flex items-center gap-1 rounded-full border border-[#e5e5e5] bg-[#f9f9f9] p-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-white hover:text-[#111] hover:shadow-sm transition-all duration-200"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-10 text-center text-sm font-semibold text-[#111]">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-white hover:text-[#111] hover:shadow-sm transition-all duration-200"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>

                                                    <div className="text-right">
                                                        {status.isSaleActive ? (
                                                            <>
                                                                <p className="text-xs text-[#999] line-through">₹{item.product.price * item.quantity}</p>
                                                                <p className="text-xl font-bold text-[#d4af37]">₹{status.currentPrice * item.quantity}</p>
                                                                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-white bg-[#d4af37] px-2 py-0.5 rounded-full mt-1">
                                                                    {status.label}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <p className="text-xl font-bold text-[#111]">₹{item.product.price * item.quantity}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {/* Mobile Continue Shopping */}
                        <div className="sm:hidden pt-4">
                            <Link
                                href="/shop"
                                className="flex items-center justify-center gap-2 text-sm font-medium text-[#666] hover:text-[#b76e79] transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6 sm:p-8 sticky top-24">
                            <h2 className="text-xl font-serif font-bold text-[#111] mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-[#666]">
                                    <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                                    <span className="text-[#111] font-medium">₹{subtotal}</span>
                                </div>

                                {totalSavings > 0 && (
                                    <div className="flex justify-between text-sm text-[#2e7d32] font-medium">
                                        <span>Sale Savings</span>
                                        <span>-₹{totalSavings}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm text-[#666]">
                                    <span>Shipping</span>
                                    <span className="text-[#2e7d32] font-medium">Free</span>
                                </div>

                                <div className="border-t border-[#e5e5e5] pt-4 mt-4">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-lg font-serif font-bold text-[#111]">Total</span>
                                        <span className="text-2xl font-bold text-[#111]">₹{total}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={authLoading}
                                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#111] px-6 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#111]/90 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {authLoading ? (
                                    <RefreshCcw className="animate-spin" size={18} />
                                ) : (
                                    <>
                                        Proceed to Checkout
                                        <ArrowLeft size={16} className="rotate-180" />
                                    </>
                                )}
                            </button>

                            {/* Trust Signals */}
                            <div className="mt-6 pt-6 border-t border-[#e5e5e5] space-y-3">
                                <div className="flex items-center gap-3 text-xs text-[#666]">
                                    <Truck size={16} className="text-[#d4af37] flex-shrink-0" />
                                    <span>Free pan-India shipping on all orders</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-[#666]">
                                    <ShieldCheck size={16} className="text-[#d4af37] flex-shrink-0" />
                                    <span>100% secure payment via Razorpay</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-[#666]">
                                    <CreditCard size={16} className="text-[#d4af37] flex-shrink-0" />
                                    <span>UPI, Cards, Netbanking accepted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
