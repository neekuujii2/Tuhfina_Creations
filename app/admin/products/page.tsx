'use client';

export const dynamic = 'force-dynamic';

import useSWR, { useSWRConfig } from 'swr';
import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { productService } from '@/lib/services/productService';
import { Product, CATEGORIES } from '@/lib/types';
import { z } from 'zod';
import Image from 'next/image';
import {
    Search,
    Plus,
    FileSpreadsheet,
    Edit,
    Trash2,
    Package,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Settings2,
} from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ProductFormModal } from '@/components/admin/ProductFormModal';

const jewelleryCollections = [
    'Rings',
    'Earrings',
    'Necklaces',
    'Bracelets',
    'Mangalsutra',
    'Wedding Collection',
];

const ALL_ADMIN_CATEGORIES = [
    ...CATEGORIES,
    ...jewelleryCollections
];

const fetcher = (url: string) => fetch(url).then(res => res.json());

const csvProductSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    price: z.coerce.number().min(0),
    category: z.string().optional(),
    isCustomizable: z.coerce.boolean().optional(),
    images: z.string().optional(),
    stock: z.coerce.number().int().min(0).optional(),
});

export default function ProductsPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const { mutate } = useSWRConfig();

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const queryParams = useMemo(() => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (categoryFilter !== 'all') params.set('category', categoryFilter);
        params.set('page', String(page));
        params.set('limit', '20');
        return params.toString();
    }, [search, categoryFilter, page]);

    const { data: productsData, error: productsError, isLoading: productsLoading } = useSWR<{ products: Product[]; total: number }>(`/api/products?${queryParams}`, fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 5000,
    });

    const products = productsData?.products || [];
    const total = productsData?.total || 0;
    const totalPages = Math.ceil(total / 20);

    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: ALL_ADMIN_CATEGORIES[0],
        isCustomizable: false,
        stock: 0,
        metaTitle: '',
        metaDescription: '',
        festivalOffer: undefined as any,
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [csvProcessing, setCsvProcessing] = useState(false);
    const [csvProgress, setCsvProgress] = useState({ current: 0, total: 0 });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" />
            </div>
        );
    }

    if (!user || !isAdmin) {
        router.push('/login');
        return null;
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploadingImages(true);
        try {
            const formData = new FormData();
            files.forEach((file) => formData.append('file', file));

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload images');

            const data = await response.json();
            setImagePreviews(data.urls);
            setImageFiles(files);
            toast('Images uploaded successfully!', 'success');
        } catch (error) {
            console.error('Error uploading images:', error);
            toast('Failed to upload images. Please try again.', 'error');
        } finally {
            setUploadingImages(false);
        }
    };

    const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCsvProcessing(true);
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;
                const rows = text.split(/\r?\n/).filter(row => row.trim());
                if (rows.length < 2) return;

                const parseCSVLine = (line: string) => {
                    const result: string[] = [];
                    let cell = '';
                    let inQuotes = false;
                    for (let i = 0; i < line.length; i++) {
                        const char = line[i];
                        if (char === '"') inQuotes = !inQuotes;
                        else if (char === ',' && !inQuotes) {
                            result.push(cell.trim());
                            cell = '';
                        } else cell += char;
                    }
                    result.push(cell.trim());
                    return result;
                };

                const headers = parseCSVLine(rows[0]).map(h => h.toLowerCase());
                const dataRows = rows.slice(1);

                setCsvProgress({ current: 0, total: dataRows.length });

                let created = 0;
                let updated = 0;
                let failed = 0;
                const failures: string[] = [];

                for (let i = 0; i < dataRows.length; i++) {
                    const row = parseCSVLine(dataRows[i]);
                    if (row.length < headers.length) continue;

                    const rowData: Record<string, string> = {};
                    headers.forEach((header, index) => {
                        rowData[header] = row[index] || '';
                    });

                    const validation = csvProductSchema.safeParse({
                        title: rowData.title,
                        description: rowData.description || '',
                        price: rowData.price || '0',
                        category: rowData.category || ALL_ADMIN_CATEGORIES[0],
                        isCustomizable: rowData.iscustomizable || false,
                        images: rowData.images || rowData.image || '',
                        stock: rowData.stock || '0',
                    });

                    if (!validation.success) {
                        failed++;
                        failures.push(`Row ${i + 1}: ${validation.error.errors.map(e => e.message).join(', ')}`);
                        setCsvProgress(prev => ({ ...prev, current: i + 1 }));
                        continue;
                    }

                    try {
                        const { data: existingProducts } = await fetch(`/api/products?search=${encodeURIComponent(validation.data.title)}&limit=1`).then(res => res.json());
                        const existing = existingProducts?.[0];

                        if (existing) {
                            await productService.updateProduct(existing.id, {
                                title: validation.data.title,
                                description: validation.data.description,
                                price: validation.data.price,
                                category: validation.data.category,
                                isCustomizable: validation.data.isCustomizable,
                                stock: validation.data.stock,
                            }, validation.data.images ? [validation.data.images] : undefined);
                            updated++;
                        } else {
                            await productService.createProduct(
                                {
                                    title: validation.data.title,
                                    description: validation.data.description,
                                    price: validation.data.price,
                                    category: validation.data.category,
                                    isCustomizable: validation.data.isCustomizable,
                                    stock: validation.data.stock,
                                },
                                validation.data.images ? [validation.data.images] : []
                            );
                            created++;
                        }
                    } catch (err) {
                        failed++;
                        failures.push(`Row ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
                    }
                    setCsvProgress(prev => ({ ...prev, current: i + 1 }));
                }

                const summary = `CSV Import Complete: ${created} created, ${updated} updated, ${failed} failed`;
                if (failures.length > 0) {
                    console.warn('CSV failures:', failures);
                }
                toast(summary, failed > 0 ? 'info' : 'success');
                mutate(`/api/products?${queryParams}`);
            } catch (error) {
                console.error('CSV Parsing Error:', error);
                toast('Failed to parse CSV file', 'error');
            } finally {
                setCsvProcessing(false);
                if (e.target) e.target.value = '';
            }
        };

        reader.readAsText(file);
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingProduct) {
                await productService.updateProduct(
                    editingProduct.id,
                    {
                        ...formData,
                        price: Number(formData.price),
                        stock: Number(formData.stock),
                        metaTitle: formData.metaTitle || undefined,
                        metaDescription: formData.metaDescription || undefined,
                    },
                    imagePreviews.length > 0 ? imagePreviews : undefined
                );
                toast('Product updated successfully!', 'success');
            } else {
                if (imagePreviews.length === 0) {
                    toast('Please upload at least one image', 'info');
                    setSubmitting(false);
                    return;
                }

                await productService.createProduct(
                    {
                        ...formData,
                        price: Number(formData.price),
                        stock: Number(formData.stock),
                        metaTitle: formData.metaTitle || undefined,
                        metaDescription: formData.metaDescription || undefined,
                    },
                    imagePreviews
                );
                toast('New product created successfully!', 'success');
            }

            setShowProductModal(false);
            setEditingProduct(null);
            setFormData({
                title: '',
                description: '',
                price: '',
                category: ALL_ADMIN_CATEGORIES[0],
                isCustomizable: false,
                stock: 0,
                metaTitle: '',
                metaDescription: '',
                festivalOffer: undefined
            });
            setImageFiles([]);
            setImagePreviews([]);
            mutate(`/api/products?${queryParams}`);
        } catch (error) {
            console.error('Error saving product:', error);
            toast('Failed to save product details', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            isCustomizable: product.isCustomizable,
            stock: product.stock ?? 0,
            metaTitle: (product as any).metaTitle || '',
            metaDescription: (product as any).metaDescription || '',
            festivalOffer: product.festivalOffer ? {
                price: product.festivalOffer.price,
                startAt: new Date(product.festivalOffer.startAt),
                endAt: new Date(product.festivalOffer.endAt),
                label: product.festivalOffer.label || '',
                isFlash: product.festivalOffer.isFlash || false,
            } : undefined
        });
        setImagePreviews(product.images);
        setShowProductModal(true);
    };

    const handleDeleteProduct = async () => {
        if (!deleteProductId) return;
        try {
            await productService.deleteProduct(deleteProductId);
            toast('Product deleted successfully', 'success');
            setSelectedIds(prev => prev.filter(id => id !== deleteProductId));
            mutate(`/api/products?${queryParams}`);
        } catch (error) {
            console.error('Error deleting product:', error);
            toast('Failed to delete product', 'error');
        } finally {
            setDeleteProductId(null);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        try {
            await fetch(`/api/products?ids=${selectedIds.join(',')}`, { method: 'DELETE' });
            toast(`Deleted ${selectedIds.length} products`, 'success');
            setSelectedIds([]);
            mutate(`/api/products?${queryParams}`);
        } catch (error) {
            toast('Failed to delete products', 'error');
        }
    };

    if (productsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" />
            </div>
        );
    }

    if (productsError) {
        return (
            <div className="text-center py-16">
                <p className="text-red-600 font-semibold">Failed to load products</p>
                <Button variant="luxury" onClick={() => mutate(`/api/products?${queryParams}`)} className="mt-4">Retry</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-primary">Catalog Directory</h2>
                    <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
                        {total} products in catalog
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="input-luxury pl-9 text-sm w-full lg:w-64"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                        className="input-luxury text-sm w-full lg:w-auto"
                    >
                        <option value="all">All Categories</option>
                        {ALL_ADMIN_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <label className={`btn-outline-luxury flex items-center gap-2 cursor-pointer text-xs font-semibold py-2 px-4 rounded-full ${csvProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                        <FileSpreadsheet size={16} />
                        <span>{csvProcessing ? `Importing (${csvProgress.current}/${csvProgress.total})` : 'Import CSV'}</span>
                        <input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={handleCsvUpload}
                            disabled={csvProcessing}
                        />
                    </label>
                    <Button
                        onClick={() => {
                            setEditingProduct(null);
                            setFormData({
                                title: '',
                                description: '',
                                price: '',
                                category: ALL_ADMIN_CATEGORIES[0],
                                isCustomizable: false,
                                stock: 0,
                                metaTitle: '',
                                metaDescription: '',
                                festivalOffer: undefined
                            });
                            setImagePreviews([]);
                            setImageFiles([]);
                            setShowProductModal(true);
                        }}
                        variant="luxury"
                        className="flex items-center gap-1.5 py-2 px-4 rounded-full"
                    >
                        <Plus size={16} /> Add Product
                    </Button>
                </div>
            </div>

            {selectedIds.length > 0 && (
                <div className="bg-luxury-warm/40 border border-accent/20 rounded-2xl p-4 flex flex-wrap items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {selectedIds.length} selected
                    </span>
                    <Button variant="luxury" size="sm" onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
                        Delete Selected
                    </Button>
                    <Button variant="outline-luxury" size="sm" onClick={() => setSelectedIds([])}>
                        Clear Selection
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="relative group">
                        <div className="absolute top-2 left-2 z-10">
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(product.id)}
                                onChange={() => setSelectedIds(prev =>
                                    prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id]
                                )}
                                className="w-4 h-4 accent-accent"
                            />
                        </div>
                        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-soft flex flex-col justify-between">
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
                                <div className="absolute top-2 right-2 flex gap-1">
                                    {(product.stock === 0) && (
                                        <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            Out of Stock
                                        </span>
                                    )}
                                    {(product.stock > 0 && product.stock < 5) && (
                                        <span className="bg-yellow-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            Low Stock ({product.stock})
                                        </span>
                                    )}
                                </div>
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
                                        <div className="flex gap-1">
                                            {product.isCustomizable && (
                                                <span className="text-[9px] font-bold tracking-wider uppercase bg-accent/15 text-accent px-2 py-0.5 rounded-full">
                                                    Customizable
                                                </span>
                                            )}
                                            {(product as any).metaTitle && (
                                                <span className="text-[9px] font-bold tracking-wider uppercase bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <Settings2 size={10} /> SEO
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditProduct(product)}
                                            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-luxury-warm/80 border border-accent/20 text-accent rounded-xl hover:bg-accent hover:text-white transition duration-200 text-xs font-semibold"
                                        >
                                            <Edit size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDeleteProductId(product.id);
                                                setDeleteConfirmOpen(true);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition duration-200 text-xs font-semibold"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline-luxury"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex items-center gap-1"
                    >
                        <ChevronLeft size={14} />
                        Previous
                    </Button>
                    <span className="text-xs text-text-secondary font-semibold">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline-luxury"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="flex items-center gap-1"
                    >
                        Next
                        <ChevronRight size={14} />
                    </Button>
                </div>
            )}

            <ProductFormModal
                open={showProductModal}
                onOpenChange={setShowProductModal}
                editingProduct={editingProduct}
                formData={formData}
                setFormData={setFormData}
                imagePreviews={imagePreviews}
                setImagePreviews={setImagePreviews}
                setImageFiles={setImageFiles}
                submitting={submitting}
                uploadingImages={uploadingImages}
                onSubmit={handleProductSubmit}
                onImageChange={handleImageChange}
            />

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Delete Product"
                description="Are you sure you want to delete this product? This action cannot be undone."
                confirmLabel="Delete"
                onConfirm={handleDeleteProduct}
            />
        </div>
    );
}