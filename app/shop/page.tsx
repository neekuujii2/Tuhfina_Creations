'use client';

import { Suspense, useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, CATEGORIES, CategoryOffer, FestivalConfig } from '@/lib/types';
import { productService } from '@/lib/services/productService';
import { resolveProductPrice } from '@/lib/saleUtils';
import ProductCard from '@/components/cards/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, ArrowUpDown, RotateCcw, X, Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const jewelleryCollections = [
    'Rings',
    'Earrings',
    'Necklaces',
    'Bracelets',
    'Mangalsutra',
    'Wedding Collection',
];

const ALL_FILTER_CATEGORIES = [
    'all',
    ...CATEGORIES,
    ...jewelleryCollections
];

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categoryParam = searchParams.get('category');

    const [products, setProducts] = useState<Product[]>([]);
    const [categoryOffers, setCategoryOffers] = useState<CategoryOffer[]>([]);
    const [festivalConfig, setFestivalConfig] = useState<FestivalConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [tempCategory, setTempCategory] = useState<string>(categoryParam || 'all');
    const [tempPriceMax, setTempPriceMax] = useState<number>(25000);
    const [tempSort, setTempSort] = useState<string>('newest');

    const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
    const [sortBy, setSortBy] = useState<string>('newest');
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 25000 });

    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam);
            setTempCategory(categoryParam);
        } else {
            setSelectedCategory('all');
            setTempCategory('all');
        }
    }, [categoryParam]);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [fetchedProducts, categoryOffersData, festivalConfigData] = await Promise.all([
                productService.getAllProducts(),
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
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const applyFilters = () => {
        setSelectedCategory(tempCategory);
        setPriceRange({ min: 0, max: tempPriceMax });
        setSortBy(tempSort);
        setShowFilters(false);
        if (tempCategory === 'all') {
            router.push('/shop');
        } else {
            router.push(`/shop?category=${encodeURIComponent(tempCategory)}`);
        }
    };

    const resetFilters = () => {
        setTempCategory('all');
        setTempPriceMax(25000);
        setTempSort('newest');
        setSelectedCategory('all');
        setPriceRange({ min: 0, max: 25000 });
        setSortBy('newest');
        setShowFilters(false);
        router.push('/shop');
    };

    const processedProducts = useMemo(() => {
        let items = [...products];

        if (selectedCategory !== 'all') {
            items = items.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
        }

        items = items.filter(p => {
            const status = resolveProductPrice(p, categoryOffers, festivalConfig);
            const currentPrice = status.currentPrice;
            return currentPrice >= priceRange.min && currentPrice <= priceRange.max;
        });

        items.sort((a, b) => {
            const statusA = resolveProductPrice(a, categoryOffers, festivalConfig);
            const statusB = resolveProductPrice(b, categoryOffers, festivalConfig);

            if (sortBy === 'price-asc') {
                return statusA.currentPrice - statusB.currentPrice;
            }
            if (sortBy === 'price-desc') {
                return statusB.currentPrice - statusA.currentPrice;
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return items;
    }, [products, selectedCategory, priceRange, sortBy, categoryOffers, festivalConfig]);

    return (
        <div className="bg-background min-h-screen">
            {/* Elegant Header */}
            <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.08),_transparent_45%),linear-gradient(135deg,_#fdf8f3_0%,_#f7efe8_100%)] border-b border-border py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-2">Exquisite collections</p>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                        The Tuhfina Gallery
                    </h1>
                    <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed font-light">
                        Browse our curated catalog of luxury jewellery, customized keepsakes, and handcrafted bridal accessories.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Top Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-border pb-6 mb-8">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Button
                            variant="outline-luxury"
                            size="sm"
                            onClick={() => setShowFilters(true)}
                            className="flex items-center gap-2"
                        >
                            <SlidersHorizontal size={16} /> Filters
                        </Button>
                        <p className="text-xs font-bold tracking-wider text-text-secondary uppercase">
                            Showing {processedProducts.length} premium pieces
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                        <div className="flex items-center gap-2">
                            <ArrowUpDown size={14} className="text-accent" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent border border-border rounded-full text-xs font-semibold px-4 py-2 outline-none focus:border-accent transition"
                            >
                                <option value="newest">New Arrivals</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                        <Button variant="ghost-luxury" size="sm" onClick={resetFilters} className="text-xs flex items-center gap-1">
                            <RotateCcw size={12} /> Reset
                        </Button>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, idx) => (
                            <div key={idx} className="space-y-4">
                                <Skeleton className="h-64 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))
                    ) : processedProducts.length === 0 ? (
                        <div className="col-span-full text-center py-24 bg-luxury-warm/20 rounded-[28px] border border-dashed border-accent/20 p-8">
                            <p className="text-xl text-primary font-serif font-semibold">No luxury products found</p>
                            <p className="text-sm text-text-secondary mt-2 mb-6">Try refining your filter settings or search query.</p>
                            <Button variant="outline-luxury" onClick={resetFilters} className="text-xs uppercase font-bold tracking-wider">
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        processedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                categoryOffers={categoryOffers}
                                festivalConfig={festivalConfig}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Slide-over Filter Panel */}
            <AnimatePresence>
                {showFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm hidden md:block"
                            onClick={() => setShowFilters(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed inset-y-0 left-0 z-50 w-[400px] bg-white shadow-premium overflow-y-auto hidden md:block"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6 border-b border-border pb-3">
                                    <h3 className="font-serif font-bold text-xl">Filters</h3>
                                    <button onClick={() => setShowFilters(false)} className="p-1 rounded-full bg-surface text-primary"><X size={16} /></button>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h4 className="font-bold text-xs uppercase tracking-wider text-accent mb-3">Category</h4>
                                        <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto pr-1">
                                            {ALL_FILTER_CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setTempCategory(cat)}
                                                    className={`text-left text-sm py-2 px-3 rounded-xl flex items-center justify-between ${
                                                        tempCategory.toLowerCase() === cat.toLowerCase()
                                                            ? 'bg-accent/10 text-accent font-semibold'
                                                            : 'text-text-secondary hover:bg-surface'
                                                    }`}
                                                >
                                                    <span>{cat === 'all' ? 'All Products' : cat}</span>
                                                    {tempCategory.toLowerCase() === cat.toLowerCase() && <Check size={14} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-xs uppercase tracking-wider text-accent mb-3">Price Range</h4>
                                        <input
                                            type="range"
                                            min="0"
                                            max="25000"
                                            step="500"
                                            value={tempPriceMax}
                                            onChange={(e) => setTempPriceMax(Number(e.target.value))}
                                            className="w-full accent-accent"
                                        />
                                        <div className="flex justify-between items-center mt-2 text-xs">
                                            <span>₹0</span>
                                            <span className="font-semibold">Up to ₹{tempPriceMax}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-xs uppercase tracking-wider text-accent mb-3">Sort By</h4>
                                        <div className="flex flex-col gap-1">
                                            {[
                                                { value: 'newest', label: 'Newest' },
                                                { value: 'price-asc', label: 'Price: Low to High' },
                                                { value: 'price-desc', label: 'Price: High to Low' },
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setTempSort(option.value)}
                                                    className={`text-left text-sm py-2 px-3 rounded-xl flex items-center justify-between ${
                                                        tempSort === option.value
                                                            ? 'bg-accent/10 text-accent font-semibold'
                                                            : 'text-text-secondary hover:bg-surface'
                                                    }`}
                                                >
                                                    <span>{option.label}</span>
                                                    {tempSort === option.value && <Check size={14} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <Button variant="luxury" className="flex-1" onClick={applyFilters}>
                                        Apply Filters
                                    </Button>
                                    <Button variant="outline-luxury" onClick={resetFilters}>
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Mobile Bottom Sheet */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
                            onClick={() => setShowFilters(false)}
                        >
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'tween', duration: 0.3 }}
                                className="absolute inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-[32px] shadow-premium overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6 border-b border-border pb-3">
                                        <h3 className="font-serif font-bold text-xl">Filters</h3>
                                        <button onClick={() => setShowFilters(false)} className="p-1 rounded-full bg-surface text-primary"><X size={16} /></button>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-bold text-xs uppercase tracking-wider text-accent mb-3">Category</h4>
                                            <div className="flex flex-col gap-1 max-h-[180px] overflow-y-auto pr-1">
                                                {ALL_FILTER_CATEGORIES.map((cat) => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setTempCategory(cat)}
                                                        className={`text-left text-sm py-2 px-3 rounded-xl flex items-center justify-between ${
                                                            tempCategory.toLowerCase() === cat.toLowerCase()
                                                                ? 'bg-accent/10 text-accent font-semibold'
                                                                : 'text-text-secondary'
                                                        }`}
                                                    >
                                                        <span>{cat === 'all' ? 'All Products' : cat}</span>
                                                        {tempCategory.toLowerCase() === cat.toLowerCase() && <Check size={14} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-xs uppercase tracking-wider text-accent mb-3">Price Range</h4>
                                            <input
                                                type="range"
                                                min="0"
                                                max="25000"
                                                step="500"
                                                value={tempPriceMax}
                                                onChange={(e) => setTempPriceMax(Number(e.target.value))}
                                                className="w-full accent-accent"
                                            />
                                            <div className="flex justify-between items-center mt-2 text-xs">
                                                <span>₹0</span>
                                                <span className="font-semibold">Up to ₹{tempPriceMax}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-xs uppercase tracking-wider text-accent mb-3">Sort By</h4>
                                            <div className="flex flex-col gap-1">
                                                {[
                                                    { value: 'newest', label: 'Newest' },
                                                    { value: 'price-asc', label: 'Price: Low to High' },
                                                    { value: 'price-desc', label: 'Price: High to Low' },
                                                ].map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => setTempSort(option.value)}
                                                        className={`text-left text-sm py-2 px-3 rounded-xl flex items-center justify-between ${
                                                            tempSort === option.value
                                                                ? 'bg-accent/10 text-accent font-semibold'
                                                                : 'text-text-secondary'
                                                        }`}
                                                    >
                                                        <span>{option.label}</span>
                                                        {tempSort === option.value && <Check size={14} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex gap-3">
                                        <Button variant="luxury" className="flex-1" onClick={applyFilters}>
                                            Apply Filters
                                        </Button>
                                        <Button variant="outline-luxury" onClick={resetFilters}>
                                            Reset
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}
