'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Clock, Sparkles } from 'lucide-react';
import { Product, CategoryOffer, FestivalConfig } from '@/lib/types';
import { resolveProductPrice } from '@/lib/saleUtils';
import { Badge } from '@/components/ui/badge';
import CountdownTimer from '@/components/CountdownTimer';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/toast';

interface ProductCardProps {
    product: Product;
    categoryOffers: CategoryOffer[];
    festivalConfig: FestivalConfig | null;
}

export default function ProductCard({ product, categoryOffers, festivalConfig }: ProductCardProps) {
    const [hovered, setHovered] = useState(false);
    const { addToCart } = useCart();
    const { toast } = useToast();
    
    const status = resolveProductPrice(product, categoryOffers, festivalConfig);
    const hasMultipleImages = product.images && product.images.length > 1;
    const displayImage = hovered && hasMultipleImages ? product.images[1] : (product.images?.[0] || '');

    const handleAddToCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        addToCart({
            productId: product.id,
            quantity: 1,
        });
        
        toast(`Added ${product.title} to cart!`, 'success');
    };

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toast(`Added ${product.title} to wishlist!`, 'info');
    };

    return (
        <Link href={`/product/${product.id}`} className="group block">
            <motion.div 
                className="luxury-card-hover overflow-hidden bg-white"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-luxury-gray/10">
                    {displayImage ? (
                        <Image
                            src={displayImage}
                            alt={product.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-5xl">
                            🎁
                        </div>
                    )}

                    {/* Badge Overlays */}
                    <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
                        {status.isSaleActive && (
                            <Badge 
                                variant={status.isFlash ? "flash" : "gold"} 
                                icon={status.isFlash ? <Clock size={12} /> : <Sparkles size={12} />}
                            >
                                {status.label}
                            </Badge>
                        )}
                        {product.isCustomizable && (
                            <Badge variant="custom">
                                Customizable
                            </Badge>
                        )}
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleWishlistClick}
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-soft transition hover:text-accent"
                            title="Add to Wishlist"
                        >
                            <Heart size={18} />
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleAddToCartClick}
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-soft transition hover:bg-accent hover:text-primary"
                            title="Add to Cart"
                        >
                            <ShoppingCart size={18} />
                        </motion.button>
                    </div>

                    {/* Countdown Timer for Flash Sale */}
                    {status.isFlash && (
                        <div className="absolute bottom-3 left-3 right-3 z-10">
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

                {/* Content */}
                <div className="p-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-accent mb-1">{product.category}</p>
                    <h3 className="font-serif text-lg font-semibold text-primary line-clamp-1 group-hover:text-accent transition-colors duration-300 mb-1">
                        {product.title}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
                        {product.description}
                    </p>
                    
                    <div className="flex items-baseline gap-2">
                        {status.isSaleActive ? (
                            <>
                                <span className="text-lg font-bold text-[#d4af37]">
                                    ₹{status.currentPrice}
                                </span>
                                <span className="text-sm text-text-secondary line-through">
                                    ₹{product.price}
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-primary">
                                ₹{product.price}
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
