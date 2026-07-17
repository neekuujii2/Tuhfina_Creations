'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { productService } from '@/lib/services/productService';
import { orderService } from '@/lib/services/orderService';
import { Product, Order, CATEGORIES, CategoryOffer, FestivalConfig } from '@/lib/types';
import Image from 'next/image';
import {
    Plus,
    Package,
    ShoppingBag,
    Edit,
    Trash2,
    X,
    Upload,
    AlertCircle,
    Sparkles,
    Calendar,
    Tag,
    Clock,
    LayoutDashboard,
    Settings,
    FileSpreadsheet,
    DollarSign,
    LogOut,
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import { useToast } from '@/components/ui/toast';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

export default function AdminDashboard() {
    const { user, isAdmin, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'categories' | 'settings'>('products');
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [dbCategories, setDbCategories] = useState<any[]>([]);
    const [categoryOffers, setCategoryOffers] = useState<CategoryOffer[]>([]);
    const [festivalConfig, setFestivalConfig] = useState<FestivalConfig | null>(null);
    const [settings, setSettings] = useState<any>({});
    const [pageLoading, setPageLoading] = useState(true);

    // Product Form State
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        price: string;
        category: string;
        isCustomizable: boolean;
        festivalOffer?: {
            price: number;
            startAt: Date;
            endAt: Date;
            label: string;
            isFlash: boolean;
        };
    }>({
        title: '',
        description: '',
        price: '',
        category: ALL_ADMIN_CATEGORIES[0],
        isCustomizable: false,
    });

    const [festivalForm, setFestivalForm] = useState<Omit<FestivalConfig, '_id'>>({
        active: false,
        bannerText: 'Festival Sale is LIVE! ✨',
        bannerSubtext: '',
        bannerImage: '',
        startAt: new Date(),
        endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const [categoryOfferForm, setCategoryOfferForm] = useState<Omit<CategoryOffer, '_id'>>({
        category: ALL_ADMIN_CATEGORIES[0],
        discountPercent: 0,
        fixedPrice: 0,
        startAt: new Date(),
        endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        label: '',
        isFlash: false,
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [csvProcessing, setCsvProcessing] = useState(false);
    const [csvProgress, setCsvProgress] = useState({ current: 0, total: 0 });

    const loadData = useCallback(async () => {
        setPageLoading(true);
        try {
            const [productsData, ordersData, categoriesData, settingsData, categoryOffersData, festivalConfigData] = await Promise.all([
                productService.getAllProducts(),
                orderService.getAllOrders(),
                fetch('/api/categories').then(res => res.json()),
                fetch('/api/settings').then(res => res.json()),
                fetch('/api/category-offers').then(res => res.json()),
                fetch('/api/festival-config').then(res => res.json()),
            ]);
            setProducts(productsData);
            setOrders(ordersData);
            setDbCategories(categoriesData);
            setSettings(settingsData);
            setCategoryOffers(categoryOffersData);
            setFestivalConfig(festivalConfigData);

            if (festivalConfigData) {
                setFestivalForm({
                    active: festivalConfigData.active,
                    bannerText: festivalConfigData.bannerText,
                    bannerSubtext: festivalConfigData.bannerSubtext || '',
                    bannerImage: festivalConfigData.bannerImage || '',
                    startAt: new Date(festivalConfigData.startAt),
                    endAt: new Date(festivalConfigData.endAt),
                });
            }
        } catch (error) {
            console.error('Error loading data:', error);
            toast('Failed to load dashboard data', 'error');
        } finally {
            setPageLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.push('/login');
            return;
        }

        if (!isAdmin) {
            router.push('/dashboard');
            return;
        }

        loadData();
    }, [user, isAdmin, authLoading, loadData, router]);

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
                    const result = [];
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

                for (let i = 0; i < dataRows.length; i++) {
                    const row = parseCSVLine(dataRows[i]);
                    if (row.length < headers.length) continue;

                    const productData: any = {};
                    let imageSource: string = '';

                    headers.forEach((header, index) => {
                        if (header === 'title') productData.title = row[index];
                        else if (header === 'description') productData.description = row[index];
                        else if (header === 'price') productData.price = Number(row[index]);
                        else if (header === 'category') productData.category = row[index];
                        else if (header === 'iscustomizable') productData.isCustomizable = row[index].toUpperCase() === 'TRUE';
                        else if (header === 'images' || header === 'image') imageSource = row[index];
                    });

                    if (productData.title && imageSource) {
                        try {
                            await productService.createProduct(
                                {
                                    title: productData.title,
                                    description: productData.description || '',
                                    price: productData.price || 0,
                                    category: productData.category || ALL_ADMIN_CATEGORIES[0],
                                    isCustomizable: productData.isCustomizable || false,
                                },
                                [imageSource]
                            );
                        } catch (err) {
                            console.error(`Failed to import row ${i + 1}:`, err);
                        }
                    }
                    setCsvProgress(prev => ({ ...prev, current: i + 1 }));
                }

                toast('CSV Bulk Import Completed!', 'success');
                loadData();
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
                festivalOffer: undefined
            });
            setImageFiles([]);
            setImagePreviews([]);
            loadData();
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

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await productService.deleteProduct(id);
            toast('Product deleted successfully', 'success');
            loadData();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast('Failed to delete product', 'error');
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
        try {
            await orderService.updateOrderStatus(orderId, status);
            toast('Order status updated successfully!', 'success');
            loadData();
        } catch (error) {
            console.error('Error updating order status:', error);
            toast('Failed to update order status', 'error');
        }
    };

    const handleCategoryImageUpdate = async (categoryName: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPageLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadRes.ok) throw new Error('Failed to upload image');
            const uploadData = await uploadRes.json();
            const imageUrl = uploadData.urls[0];

            const saveRes = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: categoryName,
                    image: imageUrl,
                }),
            });

            if (!saveRes.ok) throw new Error('Failed to save category');
            toast('Category image updated successfully', 'success');
            loadData();
        } catch (error) {
            console.error('Error updating category image:', error);
            toast('Failed to update category image', 'error');
        } finally {
            setPageLoading(false);
        }
    };

    const handleFestivalConfigUpdate = async () => {
        try {
            const res = await fetch('/api/festival-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(festivalForm)
            });
            if (res.ok) {
                toast('Global Festival configuration saved!', 'success');
                loadData();
            } else {
                throw new Error();
            }
        } catch {
            toast('Failed to save festival configuration', 'error');
        }
    };

    const handleCategoryOfferSave = async () => {
        try {
            const res = await fetch('/api/category-offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryOfferForm)
            });
            if (res.ok) {
                toast('Category offer saved successfully!', 'success');
                loadData();
            } else {
                throw new Error();
            }
        } catch {
            toast('Failed to save category offer', 'error');
        }
    };

    const handleCategoryOfferDelete = async (offerId: string) => {
        if (!confirm('Are you sure you want to delete this offer?')) return;
        try {
            const res = await fetch(`/api/category-offers?id=${offerId}`, { method: 'DELETE' });
            if (res.ok) {
                toast('Category offer deleted', 'success');
                loadData();
            } else {
                throw new Error();
            }
        } catch {
            toast('Failed to delete category offer', 'error');
        }
    };

    if (pageLoading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
            </div>
        );
    }

    // Calculate sum of order total amounts
    const totalRevenue = orders.reduce((sum, o) => o.paymentStatus === 'PAID' ? sum + o.totalAmount : sum, 0);

    return (
        <div className="bg-background min-h-screen flex">
            {/* Sidebar Navigation */}
            <aside className="w-68 bg-primary text-white flex flex-col justify-between shrink-0 border-r border-white/10">
                <div>
                    {/* Sidebar Brand Header */}
                    <div className="p-6 border-b border-white/10 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 overflow-hidden">
                            <Image src="/logo.jpg" alt="Logo" width={36} height={36} className="object-cover rounded-full" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent block">Manager</span>
                            <span className="font-serif font-bold text-sm tracking-wider">Tuhfina Control</span>
                        </div>
                    </div>

                    {/* Sidebar Nav Items */}
                    <nav className="p-4 space-y-1.5">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                                activeTab === 'products' ? 'bg-accent text-white shadow-soft font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <Package size={18} /> Products Catalog
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                                activeTab === 'orders' ? 'bg-accent text-white shadow-soft font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <ShoppingBag size={18} /> Orders Panel
                        </button>
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                                activeTab === 'categories' ? 'bg-accent text-white shadow-soft font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <LayoutDashboard size={18} /> Categories
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                                activeTab === 'settings' ? 'bg-accent text-white shadow-soft font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <Settings size={18} /> Special Engines
                        </button>
                    </nav>
                </div>

                {/* Sidebar Footer Logout */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-white/70 hover:bg-red-900/30 hover:text-red-400 transition"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 overflow-y-auto px-8 py-10">
                {/* Header */}
                <div className="mb-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary mb-1">
                            Management Portal
                        </h1>
                        <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
                            Tuhfina Control &gt; <span className="text-accent font-bold">{activeTab}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold text-primary">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span>Admin Live</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white border border-border rounded-[24px] p-6 shadow-soft relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Total Products</p>
                                <p className="text-2xl font-bold text-primary">{products.length}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center"><Package size={20} /></div>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-accent/20" />
                    </div>

                    <div className="bg-white border border-border rounded-[24px] p-6 shadow-soft relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Total Orders</p>
                                <p className="text-2xl font-bold text-primary">{orders.length}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center"><ShoppingBag size={20} /></div>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-[#d4af37]/20" />
                    </div>

                    <div className="bg-white border border-border rounded-[24px] p-6 shadow-soft relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Pending Orders</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {orders.filter((o) => o.status === 'pending').length}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><AlertCircle size={20} /></div>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-red-600/20" />
                    </div>

                    <div className="bg-white border border-border rounded-[24px] p-6 shadow-soft relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Paid Revenue</p>
                                <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><DollarSign size={20} /></div>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-green-600/20" />
                    </div>
                </div>

                {/* Products Tab Content */}
                {activeTab === 'products' && (
                    <div>
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
                            <h2 className="text-xl font-serif font-bold text-primary">Catalog Directory</h2>
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                                    onClick={() => handleEditProduct(product)}
                                                    className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-luxury-warm/80 border border-accent/20 text-accent rounded-xl hover:bg-accent hover:text-white transition duration-200 text-xs font-semibold"
                                                >
                                                    <Edit size={14} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
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
                    </div>
                )}

                {/* Orders Tab Content */}
                {activeTab === 'orders' && (
                    <div>
                        <h2 className="text-xl font-serif font-bold text-primary mb-6">Orders Inboxes</h2>

                        {orders.length === 0 ? (
                            <div className="text-center py-16 bg-surface border border-dashed border-border rounded-2xl p-8">
                                <p className="text-text-secondary font-serif">No customer orders recorded yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-white border border-border rounded-2xl p-6 shadow-soft"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-border pb-5 mb-5">
                                            <div>
                                                <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">Order Summary</p>
                                                <h3 className="font-mono text-sm text-primary font-bold">{order.id}</h3>
                                                <p className="text-xs text-text-secondary mt-1">
                                                    Email: {order.userEmail} | Date: {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Value</p>
                                                    <p className="text-xl font-bold text-[#d4af37]">₹{order.totalAmount}</p>
                                                </div>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) =>
                                                        handleUpdateOrderStatus(order.id, e.target.value as Order['status'])
                                                    }
                                                    className="bg-surface border border-border rounded-full text-xs font-bold px-4 py-2 outline-none focus:border-accent"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="CONFIRMED">Confirmed</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div>
                                                <h4 className="font-bold text-xs uppercase tracking-wider text-text-secondary mb-3">Purchased Items</h4>
                                                <div className="space-y-2">
                                                    {order.items.map((item, index) => (
                                                        <div key={index} className="flex justify-between text-xs border-b border-border/40 pb-2">
                                                            <span className="font-medium text-primary">
                                                                {item.title} <span className="text-text-secondary">× {item.quantity}</span>
                                                                {item.customization && (
                                                                    <span className="block text-[10px] font-bold text-accent">✨ Customized</span>
                                                                )}
                                                            </span>
                                                            <span className="font-bold text-primary">₹{item.price * item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-xs uppercase tracking-wider text-text-secondary mb-3">Shipping Address</h4>
                                                {order.shippingAddress ? (
                                                    <p className="text-xs text-text-secondary leading-relaxed">
                                                        <strong className="text-primary">{order.shippingAddress.name}</strong>
                                                        <br />
                                                        {order.shippingAddress.address}
                                                        <br />
                                                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                                        <br />
                                                        Phone: {order.shippingAddress.phone}
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-text-secondary italic">No address provided</p>
                                                )}
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-xs uppercase tracking-wider text-text-secondary mb-3">Payments</h4>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-xs">
                                                        <span>Status:</span>
                                                        <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                            {order.paymentStatus || 'PENDING'}
                                                        </span>
                                                    </div>
                                                    {order.razorpayPaymentId && (
                                                        <div className="flex justify-between text-xs">
                                                            <span>Payment ID:</span>
                                                            <span className="font-mono text-primary">{order.razorpayPaymentId}</span>
                                                        </div>
                                                    )}
                                                    {order.invoiceUrl && (
                                                        <div className="pt-2">
                                                            <a
                                                                href={order.invoiceUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-accent hover:underline text-xs font-bold flex items-center gap-1"
                                                            >
                                                                Download PDF Invoice
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Categories Tab Content */}
                {activeTab === 'categories' && (
                    <div>
                        <h2 className="text-xl font-serif font-bold text-primary mb-6">Category Media Management</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {ALL_ADMIN_CATEGORIES.map((catName) => {
                                const dbCat = dbCategories.find(c => c.name.toLowerCase() === catName.toLowerCase());
                                return (
                                    <div key={catName} className="bg-white border border-border rounded-2xl p-6 flex flex-col items-center shadow-soft">
                                        <div className="relative h-32 w-full mb-4 bg-luxury-gray/10 rounded-xl overflow-hidden flex items-center justify-center">
                                        {dbCat?.image ? (
                                            <Image src={dbCat.image} alt={catName} fill className="object-cover" unoptimized />
                                        ) : (
                                                <span className="text-4xl">
                                                    {catName.includes('Flower') ? '🌸' :
                                                        catName.includes('Earring') ? '💎' :
                                                            catName.includes('Frame') ? '🖼️' :
                                                                catName.includes('Keychain') ? '🔑' :
                                                                    catName.includes('Diya') ? '🪔' : '🎁'}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-serif font-bold text-base text-primary mb-4">{catName}</h3>
                                        <label className="btn-outline-luxury text-xs py-2 px-4 rounded-full cursor-pointer w-full text-center">
                                            <span>Update Thumbnail</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleCategoryImageUpdate(catName, e)}
                                            />
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Settings & Special Offers Tab Content */}
                {activeTab === 'settings' && (
                    <div className="space-y-12">
                        {/* Master Festival Engine */}
                        <section className="bg-white border border-border rounded-[28px] overflow-hidden shadow-soft">
                            <div className="bg-primary/5 p-6 border-b border-border">
                                <h3 className="text-lg font-serif font-bold text-primary flex items-center">
                                    <Sparkles className="text-accent mr-3" size={20} />
                                    Master Festival Control
                                </h3>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-luxury-warm/50 rounded-2xl border border-accent/25">
                                            <div>
                                                <p className="font-bold text-primary text-sm">Global Sale Status</p>
                                                <p className="text-xs text-text-secondary mt-0.5">Master toggle switch for festival banners</p>
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    const newValue = !festivalForm.active;
                                                    const res = await fetch('/api/festival-config', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ active: newValue })
                                                    });
                                                    if (res.ok) {
                                                        toast(`Sale ${newValue ? 'activated' : 'deactivated'}!`, 'success');
                                                        loadData();
                                                    }
                                                }}
                                                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                                                    festivalForm.active ? 'bg-red-500 text-white' : 'bg-green-600 text-white'
                                                }`}
                                            >
                                                {festivalForm.active ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Banner Main Title</label>
                                                <input
                                                    type="text"
                                                    className="input-luxury text-sm"
                                                    value={festivalForm.bannerText}
                                                    onChange={e => setFestivalForm({ ...festivalForm, bannerText: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Banner Subtext</label>
                                                <input
                                                    type="text"
                                                    className="input-luxury text-sm"
                                                    value={festivalForm.bannerSubtext}
                                                    onChange={e => setFestivalForm({ ...festivalForm, bannerSubtext: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Start Time</label>
                                                <input
                                                    type="datetime-local"
                                                    className="input-luxury text-sm"
                                                    value={new Date(festivalForm.startAt).toISOString().slice(0, 16)}
                                                    onChange={e => setFestivalForm({ ...festivalForm, startAt: new Date(e.target.value) })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">End Time</label>
                                                <input
                                                    type="datetime-local"
                                                    className="input-luxury text-sm"
                                                    value={new Date(festivalForm.endAt).toISOString().slice(0, 16)}
                                                    onChange={e => setFestivalForm({ ...festivalForm, endAt: new Date(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleFestivalConfigUpdate}
                                            variant="luxury"
                                            className="w-full text-xs font-bold uppercase tracking-wider"
                                        >
                                            Update Festival Settings
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Category-wide Offers */}
                        <section className="space-y-6">
                            <h3 className="text-xl font-serif font-bold text-primary flex items-center">
                                <Tag className="text-accent mr-3" size={24} />
                                Category-wide Discounts
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Form */}
                                <div className="bg-luxury-warm/40 border border-accent/20 p-8 rounded-2xl space-y-6">
                                    <h4 className="font-serif font-bold text-primary text-base border-b border-border pb-2">Set New Category Offer</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Target Category</label>
                                            <select
                                                className="bg-white border border-border rounded-full text-sm font-semibold px-4 py-2 w-full outline-none focus:border-accent"
                                                value={categoryOfferForm.category}
                                                onChange={e => setCategoryOfferForm({ ...categoryOfferForm, category: e.target.value })}
                                            >
                                                {ALL_ADMIN_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Discount Percent (%)</label>
                                            <input
                                                type="number"
                                                className="input-luxury text-sm"
                                                value={categoryOfferForm.discountPercent}
                                                onChange={e => setCategoryOfferForm({ ...categoryOfferForm, discountPercent: Number(e.target.value), fixedPrice: 0 })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">OR Fixed Price (₹)</label>
                                            <input
                                                type="number"
                                                className="input-luxury text-sm"
                                                value={categoryOfferForm.fixedPrice}
                                                onChange={e => setCategoryOfferForm({ ...categoryOfferForm, fixedPrice: Number(e.target.value), discountPercent: 0 })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Start Time</label>
                                            <input
                                                type="datetime-local"
                                                className="input-luxury text-sm"
                                                value={new Date(categoryOfferForm.startAt).toISOString().slice(0, 16)}
                                                onChange={e => setCategoryOfferForm({ ...categoryOfferForm, startAt: new Date(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">End Time</label>
                                            <input
                                                type="datetime-local"
                                                className="input-luxury text-sm"
                                                value={new Date(categoryOfferForm.endAt).toISOString().slice(0, 16)}
                                                onChange={e => setCategoryOfferForm({ ...categoryOfferForm, endAt: new Date(e.target.value) })}
                                            />
                                        </div>
                                        <div className="col-span-2 flex items-center justify-between gap-4">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={categoryOfferForm.isFlash}
                                                    onChange={e => setCategoryOfferForm({ ...categoryOfferForm, isFlash: e.target.checked })}
                                                    className="w-5 h-5 accent-accent"
                                                />
                                                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                                                    Is Flash Sale?
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Offer Title (e.g. Diwali Deal)"
                                                className="input-luxury text-sm flex-1 max-w-[200px]"
                                                value={categoryOfferForm.label || ''}
                                                onChange={e => setCategoryOfferForm({ ...categoryOfferForm, label: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleCategoryOfferSave}
                                        variant="luxury"
                                        className="w-full text-xs font-bold uppercase tracking-wider"
                                    >
                                        Save Category Offer
                                    </Button>
                                </div>

                                {/* Active Offers List */}
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                    {categoryOffers.map(offer => (
                                        <div key={offer._id} className="bg-white border border-border p-5 rounded-2xl flex justify-between items-center shadow-soft">
                                            <div>
                                                <p className="font-serif font-bold text-primary text-base">{offer.category}</p>
                                                <p className="text-xs text-[#d4af37] font-bold mt-1 uppercase tracking-wider">
                                                    {offer.discountPercent ? `${offer.discountPercent}% OFF` : `Fixed Price: ₹${offer.fixedPrice}`}
                                                    {offer.isFlash && <span className="ml-2 bg-red-100 text-red-600 text-[9px] px-2 py-0.5 rounded-full">Flash</span>}
                                                </p>
                                                <p className="text-[10px] text-text-secondary mt-1 font-mono">
                                                    Ends At: {new Date(offer.endAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleCategoryOfferDelete(offer._id!)}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {categoryOffers.length === 0 && <p className="text-center text-text-secondary py-16 italic text-sm">No category offers active.</p>}
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </main>

            {/* Accessible Product Modal using the new Dialog component */}
            <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
                <DialogHeader onClose={() => setShowProductModal(false)}>
                    <DialogTitle>{editingProduct ? 'Edit Product Attributes' : 'Create Product Listing'}</DialogTitle>
                    <DialogDescription>Fill out all required details of the jewellery product below.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleProductSubmit} className="space-y-5">
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
                    </div>

                    {/* Enable Festival Offer Nested Control */}
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
                                onChange={handleImageChange}
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

                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={() => setShowProductModal(false)}
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
        </div>
    );
}
