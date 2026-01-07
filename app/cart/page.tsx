'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { productService } from '@/lib/services/productService';
import { Product, CategoryOffer, FestivalConfig } from '@/lib/types';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { resolveProductPrice } from '@/lib/saleUtils';
import { RefreshCcw } from 'lucide-react';

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
                        return {
                            ...item,
                            product,
                        };
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-luxury-gold border-t-transparent"></div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag className="mx-auto text-luxury-gray mb-4" size={64} />
                    <h2 className="text-3xl font-serif font-bold text-luxury-black mb-4">
                        Your cart is empty
                    </h2>
                    <p className="text-luxury-gray mb-8">
                        Add some beautiful items to your cart
                    </p>
                    <Link href="/shop" className="btn-luxury">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-serif font-bold text-luxury-black mb-12">
                    Shopping Cart
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div
                                key={item.productId}
                                className="bg-white border border-gray-200 rounded-lg p-6 card-hover"
                            >
                                <div className="flex flex-col sm:flex-row gap-6">
                                    {/* Product Image */}
                                    <div className="relative h-32 w-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                        {item.product.images && item.product.images.length > 0 ? (
                                            <Image
                                                src={item.product.images[0]}
                                                alt={item.product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl">
                                                🎁
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-serif font-semibold text-luxury-black mb-2">
                                            {item.product.title}
                                        </h3>
                                        <p className="text-luxury-gray text-sm mb-4 line-clamp-2">
                                            {item.product.description}
                                        </p>

                                        {/* Customization */}
                                        {item.customization && (
                                            <div className="mb-4 p-3 bg-luxury-cream rounded-md">
                                                <p className="text-sm font-semibold text-luxury-black mb-2">
                                                    Customization:
                                                </p>
                                                {item.customization.text && (
                                                    <p className="text-sm text-luxury-gray">
                                                        Text: {item.customization.text}
                                                    </p>
                                                )}
                                                {item.customization.imageUrl && (
                                                    <p className="text-sm text-luxury-gray">
                                                        Custom image attached
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Quantity and Price */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    className="p-1 border border-gray-300 rounded hover:border-luxury-gold transition-colors"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="text-lg font-semibold w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    className="p-1 border border-gray-300 rounded hover:border-luxury-gold transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <div className="flex flex-col items-end">
                                                    {(() => {
                                                        const status = resolveProductPrice(item.product, categoryOffers, festivalConfig);
                                                        if (status.isSaleActive) {
                                                            return (
                                                                <>
                                                                    <span className="text-sm text-luxury-gray line-through">
                                                                        ₹{item.product.price * item.quantity}
                                                                    </span>
                                                                    <span className="text-2xl font-bold text-luxury-gold">
                                                                        ₹{status.currentPrice * item.quantity}
                                                                    </span>
                                                                    <span className="text-[10px] bg-luxury-gold text-white px-2 py-0.5 rounded font-bold uppercase">
                                                                        {status.label}
                                                                    </span>
                                                                </>
                                                            );
                                                        }
                                                        return (
                                                            <span className="text-2xl font-bold text-luxury-gold">
                                                                ₹{item.product.price * item.quantity}
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.productId)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-luxury-cream rounded-lg p-8 sticky top-24">
                            <h2 className="text-2xl font-serif font-bold text-luxury-black mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-luxury-gray">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                {subtotal > total && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>Sale Savings</span>
                                        <span>-₹{subtotal - total}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-luxury-gray">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="border-t border-gray-300 pt-4">
                                    <div className="flex justify-between text-xl font-bold text-luxury-black">
                                        <span>Total</span>
                                        <span className="text-luxury-gold">₹{total}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={authLoading}
                                className="w-full btn-luxury mb-4 flex items-center justify-center space-x-2"
                            >
                                {authLoading ? <RefreshCcw className="animate-spin" size={20} /> : 'Proceed to Checkout'}
                            </button>

                            <Link
                                href="/shop"
                                className="block text-center text-luxury-gray hover:text-luxury-gold transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
