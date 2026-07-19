'use client';

import { Product } from '@/lib/types';
import Image from 'next/image';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="bg-white border border-border rounded-2xl overflow-hidden shadow-soft flex flex-col justify-between"
                >
                    <div className="relative h-44 w-full bg-luxury-gray/10">
                        {product.images && product.images.length > 0 ? (
                            <Image
                                src={product.images[0]}
                                alt={product.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl">
                                🎁
                            </div>
                        )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">{product.category}</p>
                            <h3 className="font-serif font-bold text-base text-primary mb-2 line-clamp-1">
                                {product.title}
                            </h3>
                            <p className="text-xs text-text-secondary mb-4 line-clamp-2 leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-4 pt-4 border-t border-border">
                                <span className="text-lg font-bold text-primary">₹{product.price}</span>
                                {product.isCustomizable && (
                                    <span className="text-[9px] font-bold tracking-wider uppercase bg-accent/15 text-accent px-2 py-0.5 rounded-full">
                                        Customizable
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(product)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-luxury-warm/80 border border-accent/20 text-accent rounded-xl hover:bg-accent hover:text-white transition duration-200 text-xs font-semibold"
                                >
                                    <Edit size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => onDelete(product.id)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition duration-200 text-xs font-semibold"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}