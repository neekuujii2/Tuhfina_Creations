'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Sparkles, Settings2 } from 'lucide-react';

const ALL_ADMIN_CATEGORIES = [
    'Artificial Flowers', 'Real Flowers', 'Gifts', 'Customized Earrings', 'Customized Frames', 'Customized Keychains', 'Diwali Diyas & Candles',
    'Rings', 'Earrings', 'Necklaces', 'Bracelets', 'Mangalsutra', 'Wedding Collection',
];

interface ProductFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingProduct: Product | null;
    formData: any;
    setFormData: (data: any) => void;
    imagePreviews: string[];
    setImagePreviews: (previews: string[]) => void;
    setImageFiles: (files: File[]) => void;
    submitting: boolean;
    uploadingImages: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProductFormModal({
    open,
    onOpenChange,
    editingProduct,
    formData,
    setFormData,
    imagePreviews,
    setImagePreviews,
    setImageFiles,
    submitting,
    uploadingImages,
    onSubmit,
    onImageChange,
}: ProductFormModalProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogHeader onClose={() => onOpenChange(false)}>
                <DialogTitle>{editingProduct ? 'Edit Product Attributes' : 'Create Product Listing'}</DialogTitle>
                <DialogDescription>Fill out all required details of the jewellery product below.</DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Title *</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="input-luxury"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Description *</label>
                    <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input-luxury rounded-2xl"
                        rows={3}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Price (₹) *</label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="input-luxury"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Stock *</label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                            className="input-luxury"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Category *</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="bg-white border border-border rounded-full text-sm font-semibold px-4 py-2 w-full outline-none focus:border-accent"
                    >
                        {ALL_ADMIN_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-4 p-4 bg-luxury-warm/50 border border-accent/20 rounded-2xl">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="festivalActive"
                            checked={!!formData.festivalOffer}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setFormData({
                                        ...formData,
                                        festivalOffer: {
                                            price: Number(formData.price) || 0,
                                            startAt: new Date(),
                                            endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                                            label: '',
                                            isFlash: false
                                        }
                                    });
                                } else {
                                    setFormData({ ...formData, festivalOffer: undefined });
                                }
                            }}
                            className="w-5 h-5 accent-accent"
                        />
                        <label htmlFor="festivalActive" className="text-xs font-bold uppercase tracking-wider text-primary flex items-center cursor-pointer">
                            <Sparkles size={14} className="mr-1 text-[#d4af37]" /> Active Special Offer
                        </label>
                    </div>

                    {formData.festivalOffer && (
                        <div className="grid grid-cols-2 gap-4 pl-6 border-l-2 border-accent/30 pt-2">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1">Offer Price (₹)</label>
                                <input
                                    type="number"
                                    className="input-luxury text-sm"
                                    value={formData.festivalOffer.price}
                                    onChange={e => setFormData({
                                        ...formData,
                                        festivalOffer: { ...formData.festivalOffer!, price: Number(e.target.value) }
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1">Badge (e.g. Flash Deal)</label>
                                <input
                                    type="text"
                                    className="input-luxury text-sm"
                                    value={formData.festivalOffer.label}
                                    onChange={e => setFormData({
                                        ...formData,
                                        festivalOffer: { ...formData.festivalOffer!, label: e.target.value }
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1">Start Time</label>
                                <input
                                    type="datetime-local"
                                    className="input-luxury text-sm"
                                    value={new Date(formData.festivalOffer.startAt).toISOString().slice(0, 16)}
                                    onChange={e => setFormData({
                                        ...formData,
                                        festivalOffer: { ...formData.festivalOffer!, startAt: new Date(e.target.value) }
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-text-secondary mb-1">End Time</label>
                                <input
                                    type="datetime-local"
                                    className="input-luxury text-sm"
                                    value={new Date(formData.festivalOffer.endAt).toISOString().slice(0, 16)}
                                    onChange={e => setFormData({
                                        ...formData,
                                        festivalOffer: { ...formData.festivalOffer!, endAt: new Date(e.target.value) }
                                    })}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.festivalOffer.isFlash}
                                        onChange={e => setFormData({
                                            ...formData,
                                            festivalOffer: { ...formData.festivalOffer!, isFlash: e.target.checked }
                                        })}
                                        className="w-4 h-4 accent-accent"
                                    />
                                    <span className="text-[10px] font-bold uppercase text-text-secondary">
                                        Is a countdown flash sale
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="customizable"
                        checked={formData.isCustomizable}
                        onChange={(e) =>
                            setFormData({ ...formData, isCustomizable: e.target.checked })
                        }
                        className="w-5 h-5 accent-accent"
                    />
                    <label htmlFor="customizable" className="text-xs font-bold uppercase tracking-wider text-text-secondary cursor-pointer">
                        Enable customized ordering option
                    </label>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
                        Product Images {!editingProduct && '*'}
                    </label>
                    <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-border bg-surface rounded-2xl p-6 text-center hover:border-accent transition-colors">
                            {uploadingImages ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mb-2"></div>
                                    <p className="text-xs text-text-secondary">Uploading media files...</p>
                                </div>
                            ) : (
                                <>
                                    <Upload className="mx-auto mb-2 text-text-secondary" size={24} />
                                    <p className="text-xs text-text-secondary">
                                        Upload product catalog images
                                    </p>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={onImageChange}
                            className="hidden"
                            disabled={uploadingImages}
                        />
                    </label>

                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative h-20 rounded-xl overflow-hidden border border-border">
                                    <Image
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                    >
                        <Settings2 size={14} />
                        {showAdvanced ? 'Hide' : 'Show'} Advanced (SEO)
                    </Button>
                    {showAdvanced && (
                        <div className="mt-4 space-y-4 p-4 bg-surface border border-border rounded-2xl">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Meta Title</label>
                                <input
                                    type="text"
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    className="input-luxury"
                                    placeholder="SEO title (max 60 chars)"
                                    maxLength={60}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Meta Description</label>
                                <textarea
                                    value={formData.metaDescription}
                                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                    className="input-luxury rounded-2xl"
                                    placeholder="SEO description (max 160 chars)"
                                    rows={2}
                                    maxLength={160}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        variant="outline-luxury"
                        className="py-2.5"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting}
                        variant="luxury"
                        className="py-2.5"
                    >
                        {submitting ? 'Saving changes...' : editingProduct ? 'Save Changes' : 'Create Listing'}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}