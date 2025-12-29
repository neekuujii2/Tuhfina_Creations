'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
// import Image from 'next/image'; // Removed for Cloudinary migration
import { Product, CATEGORIES } from '@/lib/types';
import { productService } from '@/lib/services/productService';
import { ShoppingCart, Heart } from 'lucide-react';

function ShopContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');

    useEffect(() => {
        loadProducts();
    }, [selectedCategory]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            let fetchedProducts;
            if (selectedCategory === 'all') {
                fetchedProducts = await productService.getAllProducts();
            } else {
                fetchedProducts = await productService.getProductsByCategory(selectedCategory);
            }
            setProducts(fetchedProducts);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

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
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                className="group bg-white rounded-lg overflow-hidden card-hover border border-gray-200"
                            >
                                <div className="relative h-64 bg-gray-100 overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/placeholder.png';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-6xl">
                                            🎁
                                        </div>
                                    )}
                                    {product.isCustomizable && (
                                        <div className="absolute top-3 right-3 bg-luxury-gold text-white text-xs px-3 py-1 rounded-full font-semibold">
                                            Customizable
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
                                        <span className="text-2xl font-bold text-luxury-gold">
                                            ₹{product.price}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                className="p-2 rounded-full bg-luxury-cream hover:bg-luxury-gold hover:text-white transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    // Add to wishlist functionality
                                                }}
                                            >
                                                <Heart size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
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
