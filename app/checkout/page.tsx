'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { productService } from '@/lib/services/productService';
import { orderService } from '@/lib/services/orderService';
import { Product, Order } from '@/lib/types';
import { CheckCircle } from 'lucide-react';

interface CartItemWithDetails {
    productId: string;
    quantity: number;
    product: Product;
    customization?: {
        text?: string;
        imageUrl?: string;
    };
}

export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        loadCartDetails();
    }, [cart, user]);

    const loadCartDetails = async () => {
        setLoading(true);
        const itemsWithDetails: CartItemWithDetails[] = [];

        for (const item of cart) {
            const product = await productService.getProduct(item.productId);
            if (product) {
                itemsWithDetails.push({
                    ...item,
                    product,
                });
            }
        }

        setCartItems(itemsWithDetails);
        setLoading(false);
    };

    const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert('Please login to continue');
            router.push('/login');
            return;
        }

        setSubmitting(true);

        try {
            const orderData: Omit<Order, 'id' | 'createdAt'> = {
                userId: user.uid,
                userEmail: user.email,
                items: cartItems.map(item => ({
                    productId: item.productId,
                    title: item.product.title,
                    price: item.product.price,
                    quantity: item.quantity,
                    imageUrl: item.product.images[0] || '',
                    customization: item.customization,
                })),
                totalAmount: total,
                status: 'pending',
                shippingAddress: {
                    name,
                    address,
                    city,
                    state,
                    pincode,
                    phone,
                },
            };

            await orderService.createOrder(orderData);
            clearCart();
            router.push('/dashboard?orderSuccess=true');
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-luxury-gold border-t-transparent"></div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        router.push('/cart');
        return null;
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-serif font-bold text-luxury-black mb-12">
                    Checkout
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Shipping Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-lg p-8">
                            <h2 className="text-2xl font-serif font-semibold mb-6">
                                Shipping Information
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-luxury-black mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input-luxury"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-luxury-black mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="input-luxury"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-luxury-black mb-2">
                                        Address *
                                    </label>
                                    <textarea
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="input-luxury"
                                        rows={3}
                                        placeholder="Street address, apartment, suite, etc."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-luxury-black mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="input-luxury"
                                            placeholder="Mumbai"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-luxury-black mb-2">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            className="input-luxury"
                                            placeholder="Maharashtra"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-luxury-black mb-2">
                                        PIN Code *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                        className="input-luxury"
                                        placeholder="400001"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full btn-luxury disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-luxury-cream rounded-lg p-8 sticky top-24">
                            <h2 className="text-2xl font-serif font-bold text-luxury-black mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.productId} className="flex gap-4">
                                        <div className="relative h-16 w-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                            {item.product.images && item.product.images.length > 0 ? (
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                                    🎁
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-luxury-black line-clamp-1">
                                                {item.product.title}
                                            </p>
                                            <p className="text-sm text-luxury-gray">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold text-luxury-gold">
                                            ₹{item.product.price * item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-300 pt-4 space-y-2">
                                <div className="flex justify-between text-luxury-gray">
                                    <span>Subtotal</span>
                                    <span>₹{total}</span>
                                </div>
                                <div className="flex justify-between text-luxury-gray">
                                    <span>Shipping</span>
                                    <span>FREE</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-luxury-black pt-2">
                                    <span>Total</span>
                                    <span className="text-luxury-gold">₹{total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
