'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Product, CATEGORIES, CategoryOffer, FestivalConfig } from '@/lib/types';
import { productService } from '@/lib/services/productService';
import { ShoppingCart, Heart, Sparkles, Clock } from 'lucide-react';
import { resolveProductPrice } from '@/lib/saleUtils';
import CountdownTimer from '@/components/CountdownTimer';

function ShopContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');

    const [products, setProducts] = useState<Product[]>([]);
    const [categoryOffers, setCategoryOffers] = useState<CategoryOffer[]>([]);
    const [festivalConfig, setFestivalConfig] = useState<FestivalConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [fetchedProducts, categoryOffersData, festivalConfigData] = await Promise.all([
                selectedCategory === 'all'
                    ? productService.getAllProducts()
                    : productService.getProductsByCategory(selectedCategory),
                fetch('/api/category-offers').then(res => res.json()),
                fetch('/api/festival-config').then(res => res.json()),
            ]);
            setProducts(fetchedProducts);
            setCategoryOffers(categoryOffersData);
            setFestivalConfig(festivalConfigData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div className="bg-white">
            {/* Header */}
            <section className="section-padding bg-luxury-cream">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-luxury-black mb-4">
                        Our Collection
                    </h1>
                    <p className="text-lg text-luxury-gray max-w-2xl mx-auto">
                        Browse our exquisite range of handcrafted gifts and personalized treasures
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Category Filter */}
                <div className="mb-12">
                    <div className="flex flex-wrap gap-3 justify-center">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${selectedCategory === 'all'
                                ? 'bg-luxury-gold text-white shadow-lg'
                                : 'bg-white text-luxury-gray border border-gray-300 hover:border-luxury-gold'
                                }`}
                        >
                            All Products
                        </button>
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                                    ? 'bg-luxury-gold text-white shadow-lg'
                                    : 'bg-white text-luxury-gray border border-gray-300 hover:border-luxury-gold'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-luxury-gold border-t-transparent"></div>
                        <p className="mt-4 text-luxury-gray">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-luxury-gray">No products found in this category.</p>
                        <p className="text-sm text-luxury-gray mt-2">Check back soon for new arrivals!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => {
                            const status = resolveProductPrice(product, categoryOffers, festivalConfig);
                            return (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.id}`}
                                    className="group bg-white rounded-lg overflow-hidden card-hover border border-gray-200"
                                >
                                    <div className="relative h-64 bg-gray-100 overflow-hidden">
                                        {product.images && product.images.length > 0 ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.title}
                                                fill
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-6xl">
                                                🎁
                                            </div>
                                        )}

                                        {/* Sale Badges */}
                                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                                            {status.isSaleActive && (
                                                <div className={`text-white text-[10px] px-3 py-1 rounded-full font-bold flex items-center shadow-lg ${status.isFlash ? 'bg-red-600' : 'bg-luxury-gold'}`}>
                                                    {status.isFlash && <Clock size={12} className="mr-1" />}
                                                    {status.label}
                                                </div>
                                            )}
                                            {product.isCustomizable && (
                                                <div className="bg-luxury-black/70 text-white text-[10px] px-3 py-1 rounded-full font-semibold backdrop-blur-sm">
                                                    Customizable
                                                </div>
                                            )}
                                        </div>

                                        {/* Flash Sale Timer */}
                                        {status.isFlash && (
                                            <div className="absolute bottom-3 left-3 right-3">
                                                <CountdownTimer
                                                    expiryDate={product.festivalOffer?.isFlash ? new Date(product.festivalOffer.endAt) : new Date(categoryOffers.find(o => o.category === product.category)?.endAt || 0)}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        <h3 className="font-serif font-semibold text-lg text-luxury-black mb-2 group-hover:text-luxury-gold transition-colors line-clamp-2">
                                            {product.title}
                                        </h3>
                                        <p className="text-sm text-luxury-gray mb-3 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                {status.isSaleActive ? (
                                                    <>
                                                        <span className="text-sm text-luxury-gray line-through">
                                                            ₹{product.price}
                                                        </span>
                                                        <span className="text-2xl font-bold text-luxury-gold">
                                                            ₹{status.currentPrice}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-2xl font-bold text-luxury-gold">
                                                        ₹{product.price}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    className="p-2 rounded-full bg-luxury-cream hover:bg-luxury-gold hover:text-white transition-colors"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                    }}
                                                >
                                                    <Heart size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ShopContent />
        </Suspense>
    );
}
