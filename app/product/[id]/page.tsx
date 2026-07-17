'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product, CategoryOffer, FestivalConfig } from '@/lib/types';
import { productService } from '@/lib/services/productService';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, Minus, Plus, Upload, ArrowLeft, Sparkles, Clock, Shield, Star, Heart } from 'lucide-react';
import { resolveProductPrice } from '@/lib/saleUtils';
import CountdownTimer from '@/components/CountdownTimer';
import { useToast } from '@/components/ui/toast';
import ProductCard from '@/components/cards/ProductCard';

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;
    const { toast } = useToast();

    const [product, setProduct] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [categoryOffers, setCategoryOffers] = useState<CategoryOffer[]>([]);
    const [festivalConfig, setFestivalConfig] = useState<FestivalConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    // Customization state
    const [customText, setCustomText] = useState('');
    const [customImage, setCustomImage] = useState<File | null>(null);
    const [customImagePreview, setCustomImagePreview] = useState<string>('');
    const [uploading, setUploading] = useState(false);

    const { addToCart } = useCart();
    const { user } = useAuth();

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [fetchedProduct, categoryOffersData, festivalConfigData] = await Promise.all([
                productService.getProduct(productId),
                fetch('/api/category-offers').then(res => res.json()),
                fetch('/api/festival-config').then(res => res.json()),
            ]);
            
            setProduct(fetchedProduct);
            setCategoryOffers(categoryOffersData);
            setFestivalConfig(festivalConfigData);

            if (fetchedProduct) {
                // Fetch similar products in the same category (limit to 4, excluding current product)
                const allSimilar = await productService.getProductsByCategory(fetchedProduct.category);
                setSimilarProducts(allSimilar.filter(p => p.id !== fetchedProduct.id).slice(0, 4));
            }
        } catch (error) {
            console.error('Error loading product details:', error);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCustomImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            toast('Custom image uploaded preview!', 'info');
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;

        let customization = undefined;

        if (product.isCustomizable && (customText || customImage)) {
            let imageUrl = '';

            if (customImage) {
                setUploading(true);
                try {
                    imageUrl = await productService.uploadCustomizationImage(customImage);
                } catch (error) {
                    console.error('Error uploading customization image:', error);
                    toast('Failed to upload customization image', 'error');
                    setUploading(false);
                    return;
                }
                setUploading(false);
            }

            customization = {
                text: customText || undefined,
                imageUrl: imageUrl || undefined,
            };
        }

        addToCart({
            productId: product.id,
            quantity,
            customization,
        });

        toast(`Added ${quantity} × ${product.title} to cart!`, 'success');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <p className="text-xl text-text-secondary mb-6 font-serif">Product not found</p>
                    <button onClick={() => router.push('/shop')} className="btn-luxury">
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    const priceStatus = resolveProductPrice(product, categoryOffers, festivalConfig);

    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumbs / Back button */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-accent transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Catalog</span>
                    </button>
                    <p className="text-xs text-text-secondary uppercase tracking-widest">
                        Shop &gt; {product.category} &gt; <span className="text-primary font-semibold">{product.title}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Media Gallery with Zoom on Hover */}
                    <div className="sticky top-28">
                        <div className="relative h-96 lg:h-[500px] w-full bg-luxury-gray/10 rounded-[28px] overflow-hidden border border-border shadow-soft group img-zoom">
                            {product.images && product.images.length > 0 ? (
                                <Image
                                    src={product.images[selectedImage]}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/placeholder.png';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-9xl">
                                    🎁
                                </div>
                            )}

                            {/* Flash Sale overlay badge */}
                            {priceStatus.isSaleActive && (
                                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                    <span className={`text-[10px] font-bold tracking-widest uppercase text-white px-4 py-1.5 rounded-full flex items-center shadow-lg ${priceStatus.isFlash ? 'bg-red-600' : 'bg-[#d4af37]'}`}>
                                        <Sparkles size={12} className="mr-1.5" />
                                        {priceStatus.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails strip */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                                            selectedImage === index
                                                ? 'border-accent shadow-soft'
                                                : 'border-border hover:border-accent'
                                        }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.title} thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/placeholder.png';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details Section */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2">{product.category}</p>
                        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary tracking-tight mb-4">
                            {product.title}
                        </h1>

                        <div className="flex flex-col mb-6 border-b border-border pb-6">
                            {priceStatus.isSaleActive ? (
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-3xl font-bold text-[#d4af37]">
                                            ₹{priceStatus.currentPrice}
                                        </span>
                                        <span className="text-lg text-text-secondary line-through">
                                            ₹{product.price}
                                        </span>
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            Save ₹{product.price - priceStatus.currentPrice}
                                        </span>
                                    </div>
                                    {priceStatus.isFlash && (
                                        <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-2xl border border-red-100 text-xs font-bold uppercase tracking-wider">
                                            <Clock size={14} /> End In:
                                            <CountdownTimer
                                                expiryDate={
                                                    product.festivalOffer?.isFlash 
                                                        ? new Date(product.festivalOffer.endAt) 
                                                        : new Date(categoryOffers.find(o => o.category === product.category)?.endAt || 0)
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <span className="text-3xl font-bold text-primary">
                                    ₹{product.price}
                                </span>
                            )}
                        </div>

                        <p className="text-text-secondary text-base leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Features List */}
                        {product.features && product.features.length > 0 && (
                            <div className="mb-8 bg-surface/50 rounded-2xl p-6 border border-border">
                                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-primary">Key Attributes</h3>
                                <ul className="space-y-3">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-start text-sm text-text-secondary">
                                            <span className="mr-2 text-accent mt-0.5">•</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Customization Area */}
                        {product.isCustomizable && (
                            <div className="bg-luxury-warm/50 border border-accent/20 rounded-[24px] p-6 mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="text-accent" size={18} />
                                    <h3 className="font-serif font-bold text-base text-primary">Bespoke Customisation</h3>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
                                            Custom Text / Engraving
                                        </label>
                                        <input
                                            type="text"
                                            value={customText}
                                            onChange={(e) => setCustomText(e.target.value)}
                                            placeholder="Enter text (e.g. initials, date)..."
                                            className="input-luxury text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
                                            Upload Custom Image
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex-1 cursor-pointer">
                                                <div className="border-2 border-dashed border-border rounded-2xl p-4 text-center hover:border-accent transition-colors bg-white">
                                                    <Upload className="mx-auto mb-2 text-text-secondary" size={20} />
                                                    <p className="text-xs text-text-secondary">
                                                        {customImage ? customImage.name : 'Upload image (JPG, PNG)...'}
                                                    </p>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        {customImagePreview && (
                                            <div className="mt-3 relative h-32 w-full rounded-2xl overflow-hidden border border-border">
                                                <Image src={customImagePreview} alt="Customisation Preview" fill className="object-cover" unoptimized />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quantity selection & Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center mb-8 border-t border-border pt-8">
                            <div className="flex items-center space-x-4 rounded-full border border-border bg-surface px-4 py-2 w-full sm:w-auto justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Qty</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-1 text-text-secondary hover:text-accent transition"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="text-base font-bold w-6 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-1 text-text-secondary hover:text-accent transition"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={uploading}
                                className="w-full btn-luxury flex items-center justify-center space-x-2 py-3.5"
                            >
                                <ShoppingCart size={18} />
                                <span className="text-xs uppercase font-bold tracking-widest">
                                    {uploading ? 'Processing Customisation...' : 'Add to Cart'}
                                </span>
                            </button>
                        </div>

                        {/* Customer trust assurances */}
                        <div className="grid grid-cols-2 gap-4 border-t border-border pt-6 text-xs text-text-secondary">
                            <div className="flex items-center gap-2">
                                <Shield size={16} className="text-accent" />
                                <span>Certified pure materials</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-accent" />
                                <span>Secured dispatching support</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Products Rail */}
                {similarProducts.length > 0 && (
                    <div className="mt-20 border-t border-border pt-16">
                        <div className="mb-10">
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-2">Completions</p>
                            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary">Similar Treasures</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {similarProducts.map((simProd) => (
                                <ProductCard
                                    key={simProd.id}
                                    product={simProd}
                                    categoryOffers={categoryOffers}
                                    festivalConfig={festivalConfig}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
