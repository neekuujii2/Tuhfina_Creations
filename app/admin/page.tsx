'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { productService } from '@/lib/services/productService';
import { orderService } from '@/lib/services/orderService';
import { Product, Order, CATEGORIES, FestivalOffer, CategoryOffer, FestivalConfig } from '@/lib/types';
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
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';

export default function AdminDashboard() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();

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
        category: typeof CATEGORIES[number];
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
        category: CATEGORIES[0],
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
        category: CATEGORIES[0],
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
        } finally {
            setPageLoading(false);
        }
    }, []);

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
            setImageFiles(files); // Keep file refs if needed for UI, but URLs are used for submit
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Failed to upload images. Please try again.');
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
                                    category: productData.category || CATEGORIES[0],
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

                alert('CSV Import Completed');
                loadData();
            } catch (error) {
                console.error('CSV Parsing Error:', error);
                alert('Failed to parse CSV');
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
                // Update existing product
                await productService.updateProduct(
                    editingProduct.id,
                    {
                        ...formData,
                        price: Number(formData.price),
                    },
                    imagePreviews.length > 0 ? imagePreviews : undefined
                );
            } else {
                // Create new product
                if (imagePreviews.length === 0) {
                    alert('Please upload at least one image');
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
            }

            // Reset form and reload
            setShowProductModal(false);
            setEditingProduct(null);
            setFormData({
                title: '',
                description: '',
                price: '',
                category: CATEGORIES[0],
                isCustomizable: false,
                festivalOffer: undefined
            });
            setImageFiles([]);
            setImagePreviews([]);
            loadData();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
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
            category: product.category as typeof CATEGORIES[number],
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
            loadData();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
        try {
            await orderService.updateOrderStatus(orderId, status);
            loadData();
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status');
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
            alert('Category image updated successfully');
            loadData();
        } catch (error) {
            console.error('Error updating category image:', error);
            alert('Failed to update category image');
        } finally {
            setPageLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-luxury-gold border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <div className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-luxury-black mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-luxury-gray">Manage products and orders</p>
                    </div>
                    <NotificationBell />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-luxury-cream rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-luxury-gray text-sm mb-1">Total Products</p>
                                <p className="text-3xl font-bold text-luxury-black">{products.length}</p>
                            </div>
                            <Package className="text-luxury-gold" size={40} />
                        </div>
                    </div>

                    <div className="bg-luxury-cream rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-luxury-gray text-sm mb-1">Total Orders</p>
                                <p className="text-3xl font-bold text-luxury-black">{orders.length}</p>
                            </div>
                            <ShoppingBag className="text-luxury-gold" size={40} />
                        </div>
                    </div>

                    <div className="bg-luxury-cream rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-luxury-gray text-sm mb-1">Pending Orders</p>
                                <p className="text-3xl font-bold text-luxury-black">
                                    {orders.filter((o) => o.status === 'pending').length}
                                </p>
                            </div>
                            <AlertCircle className="text-luxury-gold" size={40} />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`pb-4 px-6 font-semibold transition-colors ${activeTab === 'products'
                            ? 'text-luxury-gold border-b-2 border-luxury-gold'
                            : 'text-luxury-gray hover:text-luxury-gold'
                            }`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`pb-4 px-6 font-semibold transition-colors ${activeTab === 'orders'
                            ? 'text-luxury-gold border-b-2 border-luxury-gold'
                            : 'text-luxury-gray hover:text-luxury-gold'
                            }`}
                    >
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`pb-4 px-6 font-semibold transition-colors ${activeTab === 'categories'
                            ? 'text-luxury-gold border-b-2 border-luxury-gold'
                            : 'text-luxury-gray hover:text-luxury-gold'
                            }`}
                    >
                        Categories
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`pb-4 px-6 font-semibold transition-colors ${activeTab === 'settings'
                            ? 'text-luxury-gold border-b-2 border-luxury-gold'
                            : 'text-luxury-gray hover:text-luxury-gold'
                            }`}
                    >
                        Settings & Offers
                    </button>
                </div>

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-serif font-bold">Products</h2>
                            <div className="flex items-center space-x-4">
                                <label className={`btn-outline-luxury flex items-center space-x-2 cursor-pointer ${csvProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <Upload size={20} />
                                    <span>{csvProcessing ? `Importing (${csvProgress.current}/${csvProgress.total})` : 'Bulk Import CSV'}</span>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        className="hidden"
                                        onChange={handleCsvUpload}
                                        disabled={csvProcessing}
                                    />
                                </label>
                                <button
                                    onClick={() => {
                                        setEditingProduct(null);
                                        setFormData({
                                            title: '',
                                            description: '',
                                            price: '',
                                            category: CATEGORIES[0],
                                            isCustomizable: false,
                                        });
                                        setImagePreviews([]);
                                        setImageFiles([]);
                                        setShowProductModal(true);
                                    }}
                                    className="btn-luxury flex items-center space-x-2"
                                >
                                    <Plus size={20} />
                                    <span>Add Product</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white border border-gray-200 rounded-lg overflow-hidden card-hover"
                                >
                                    <div className="relative h-48 bg-gray-100">
                                        {product.images && product.images.length > 0 ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-6xl">
                                                🎁
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-serif font-semibold text-lg mb-2 line-clamp-1">
                                            {product.title}
                                        </h3>
                                        <p className="text-sm text-luxury-gray mb-3 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xl font-bold text-luxury-gold">
                                                ₹{product.price}
                                            </span>
                                            {product.isCustomizable && (
                                                <span className="text-xs bg-luxury-gold text-white px-2 py-1 rounded">
                                                    Customizable
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-luxury-cream text-luxury-gold rounded hover:bg-luxury-gold hover:text-white transition-colors"
                                            >
                                                <Edit size={16} />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                                            >
                                                <Trash2 size={16} />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div>
                        <h2 className="text-2xl font-serif font-bold mb-8">Orders</h2>

                        {orders.length === 0 ? (
                            <div className="text-center py-20 bg-luxury-cream rounded-lg">
                                <p className="text-luxury-gray">No orders yet</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-white border border-gray-200 rounded-lg p-6"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                                            <div>
                                                <p className="text-sm text-luxury-gray mb-1">
                                                    Order ID: <span className="font-mono">{order.id}</span>
                                                </p>
                                                <p className="text-sm text-luxury-gray mb-1">
                                                    Customer: {order.userEmail}
                                                </p>
                                                <p className="text-sm text-luxury-gray">
                                                    Date: {order.createdAt.toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="mt-4 md:mt-0">
                                                <p className="text-2xl font-bold text-luxury-gold mb-2">
                                                    ₹{order.totalAmount}
                                                </p>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) =>
                                                        handleUpdateOrderStatus(order.id, e.target.value as Order['status'])
                                                    }
                                                    className="input-luxury text-sm"
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

                                        <div className="border-t border-gray-200 pt-4">
                                            <h4 className="font-semibold mb-3">Order Items:</h4>
                                            <div className="space-y-2">
                                                {orders.length > 0 && order.items.map((item, index) => (
                                                    <div key={index} className="flex justify-between text-sm">
                                                        <span>
                                                            {item.title} × {item.quantity}
                                                            {item.customization && (
                                                                <span className="text-luxury-gold ml-2">✨ Customized</span>
                                                            )}
                                                        </span>
                                                        <span className="font-semibold">₹{item.price * item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {order.shippingAddress && (
                                            <div className="border-t border-gray-200 pt-4 mt-4">
                                                <h4 className="font-semibold mb-2">Shipping Address:</h4>
                                                <p className="text-sm text-luxury-gray">
                                                    {order.shippingAddress.name}
                                                    <br />
                                                    {order.shippingAddress.address}
                                                    <br />
                                                    {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                                                    {order.shippingAddress.pincode}
                                                    <br />
                                                    Phone: {order.shippingAddress.phone}
                                                </p>
                                            </div>
                                        )}
                                        <div className="border-t border-gray-200 pt-4 mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <h4 className="font-semibold mb-2 text-sm text-gray-500">Payment Status</h4>
                                                <p className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {order.paymentStatus || 'PENDING'}
                                                </p>
                                            </div>
                                            {order.razorpayPaymentId && (
                                                <div>
                                                    <h4 className="font-semibold mb-2 text-sm text-gray-500">Payment ID</h4>
                                                    <p className="font-mono text-sm">{order.razorpayPaymentId}</p>
                                                </div>
                                            )}
                                            {order.invoiceUrl && (
                                                <div>
                                                    <h4 className="font-semibold mb-2 text-sm text-gray-500">Invoice</h4>
                                                    <a
                                                        href={order.invoiceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-luxury-gold hover:underline text-sm font-semibold flex items-center"
                                                    >
                                                        Download PDF
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                    <div>
                        <h2 className="text-2xl font-serif font-bold mb-8">Manage Category Images</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {CATEGORIES.map((catName) => {
                                const dbCat = dbCategories.find(c => c.name === catName);
                                return (
                                    <div key={catName} className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center">
                                        <div className="relative h-40 w-full mb-4 bg-luxury-cream rounded-md overflow-hidden flex items-center justify-center">
                                            {dbCat?.image ? (
                                                <img src={dbCat.image} alt={catName} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-4xl">
                                                    {catName.includes('Flower') ? '🌸' :
                                                        catName.includes('Earring') ? '💎' :
                                                            catName.includes('Frame') ? '🖼️' :
                                                                catName.includes('Keychain') ? '🔑' :
                                                                    catName.includes('Diwali') ? '🪔' : '🎁'}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-serif font-semibold text-lg mb-4">{catName}</h3>
                                        <label className="btn-outline-luxury text-sm cursor-pointer w-full text-center">
                                            <span>Update Image</span>
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

                {/* Settings & Festival Engine Tab */}
                {activeTab === 'settings' && (
                    <div className="max-w-6xl space-y-12">
                        {/* 1. Global Festival Control */}
                        <section className="bg-white border border-luxury-gold/20 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-luxury-gold/5 p-6 border-b border-luxury-gold/10">
                                <h3 className="text-xl font-serif font-bold text-luxury-black flex items-center">
                                    <Sparkles className="text-luxury-gold mr-3" size={24} />
                                    Master Festival Control
                                </h3>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-luxury-cream rounded-lg">
                                            <div>
                                                <p className="font-bold text-luxury-black">Global Sale Status</p>
                                                <p className="text-sm text-luxury-gray">Master switch for all festival UI</p>
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    const newValue = !festivalForm.active;
                                                    const res = await fetch('/api/festival-config', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ active: newValue })
                                                    });
                                                    if (res.ok) loadData();
                                                }}
                                                className={`px-6 py-2 rounded-full font-bold transition-all ${festivalForm.active
                                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                    }`}
                                            >
                                                {festivalForm.active ? 'Deactivate Sale' : 'Activate Sale'}
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Banner Title</label>
                                                <input
                                                    type="text"
                                                    className="input-luxury"
                                                    value={festivalForm.bannerText}
                                                    onChange={e => setFestivalForm({ ...festivalForm, bannerText: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Banner Subtext</label>
                                                <input
                                                    type="text"
                                                    className="input-luxury"
                                                    value={festivalForm.bannerSubtext}
                                                    onChange={e => setFestivalForm({ ...festivalForm, bannerSubtext: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Start Date & Time</label>
                                                <input
                                                    type="datetime-local"
                                                    className="input-luxury"
                                                    value={new Date(festivalForm.startAt).toISOString().slice(0, 16)}
                                                    onChange={e => setFestivalForm({ ...festivalForm, startAt: new Date(e.target.value) })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2">End Date & Time</label>
                                                <input
                                                    type="datetime-local"
                                                    className="input-luxury"
                                                    value={new Date(festivalForm.endAt).toISOString().slice(0, 16)}
                                                    onChange={e => setFestivalForm({ ...festivalForm, endAt: new Date(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                const res = await fetch('/api/festival-config', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify(festivalForm)
                                                });
                                                if (res.ok) alert('Global Config Saved');
                                            }}
                                            className="w-full btn-luxury"
                                        >
                                            Update Global Config
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Category Offers */}
                        <section className="space-y-6">
                            <h3 className="text-2xl font-serif font-bold text-luxury-black flex items-center">
                                <Tag className="text-luxury-gold mr-3" size={28} />
                                Category-wide Offers
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Form */}
                                <div className="bg-luxury-cream p-8 rounded-xl space-y-6">
                                    <h4 className="font-bold border-b border-luxury-gold/20 pb-2">Set New Category Offer</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-bold mb-2">Select Category</label>
                                            <select
                                                className="input-luxury"
                                                value={categoryOfferForm.category}
                                                onChange={e => setCategoryOfferForm({ ...categoryOfferForm, category: e.target.value })}
                                            >
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Discount %</label>
                                            <input
                                                type="number"
                                                className="input-luxury"
                                                value={categoryOfferForm.discountPercent}
                                                onChange={e => setCategoryOfferForm({ ...categoryOfferForm, discountPercent: Number(e.target.value), fixedPrice: 0 })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">OR Fixed Price (₹)</label>
                                            <input
                                                type="number"
                                                className="input-luxury"
                                                value={categoryOfferForm.fixedPrice}
                                                onChange={e => setCategoryOfferForm({ ...categoryOfferForm, fixedPrice: Number(e.target.value), discountPercent: 0 })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Start At</label>
                                            <input
                                                type="datetime-local"
                                                className="input-luxury"
                                                value={new Date(categoryOfferForm.startAt).toISOString().slice(0, 16)}
                                                onChange={e => setCategoryOfferForm({ ...categoryOfferForm, startAt: new Date(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">End At</label>
                                            <input
                                                type="datetime-local"
                                                className="input-luxury"
                                                value={new Date(categoryOfferForm.endAt).toISOString().slice(0, 16)}
                                                onChange={e => setCategoryOfferForm({ ...categoryOfferForm, endAt: new Date(e.target.value) })}
                                            />
                                        </div>
                                        <div className="col-span-2 flex items-center space-x-4">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={categoryOfferForm.isFlash}
                                                    onChange={e => setCategoryOfferForm({ ...categoryOfferForm, isFlash: e.target.checked })}
                                                    className="w-5 h-5 accent-luxury-gold"
                                                />
                                                <span className="font-bold flex items-center">
                                                    <Clock size={16} className="mr-1" /> Is Flash Sale?
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Offer Label (e.g. Diwali Sale)"
                                                className="input-luxury flex-1"
                                                value={categoryOfferForm.label || ''}
                                                onChange={e => setCategoryOfferForm({ ...categoryOfferForm, label: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            const res = await fetch('/api/category-offers', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify(categoryOfferForm)
                                            });
                                            if (res.ok) {
                                                alert('Category Offer Saved');
                                                loadData();
                                            }
                                        }}
                                        className="w-full btn-luxury"
                                    >
                                        Save Category Offer
                                    </button>
                                </div>

                                {/* List */}
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                    {categoryOffers.map(offer => (
                                        <div key={offer._id} className="bg-white border border-gray-200 p-4 rounded-lg flex justify-between items-center shadow-sm">
                                            <div>
                                                <p className="font-bold text-luxury-black">{offer.category}</p>
                                                <p className="text-sm text-luxury-gold font-semibold">
                                                    {offer.discountPercent ? `${offer.discountPercent}% OFF` : `Fixed ₹${offer.fixedPrice}`}
                                                    {offer.isFlash && <span className="ml-2 uppercase text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded">Flash</span>}
                                                </p>
                                                <p className="text-[11px] text-luxury-gray">
                                                    {new Date(offer.startAt).toLocaleString()} - {new Date(offer.endAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Delete this offer?')) {
                                                        await fetch(`/api/category-offers?id=${offer._id}`, { method: 'DELETE' });
                                                        loadData();
                                                    }
                                                }}
                                                className="text-red-400 hover:text-red-600 p-2"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    ))}
                                    {categoryOffers.length === 0 && <p className="text-center text-luxury-gray py-10 italic">No category offers active.</p>}
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            {showProductModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif font-bold">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <button
                                    onClick={() => setShowProductModal(false)}
                                    className="text-luxury-gray hover:text-luxury-gold"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleProductSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="input-luxury"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Description *</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="input-luxury"
                                        rows={4}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Price (₹) *</label>
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
                                        <label className="block text-sm font-medium mb-2">Category *</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value as typeof CATEGORIES[number] })}
                                            className="input-luxury"
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4 p-4 bg-luxury-cream rounded-lg">
                                    <div className="flex items-center space-x-3">
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
                                            className="w-5 h-5 accent-luxury-gold"
                                        />
                                        <label htmlFor="festivalActive" className="text-sm font-bold flex items-center">
                                            <Sparkles size={16} className="mr-1 text-luxury-gold" /> Enable Festival Offer
                                        </label>
                                    </div>

                                    {formData.festivalOffer && (
                                        <div className="grid grid-cols-2 gap-4 pl-8 border-l-2 border-luxury-gold/20">
                                            <div>
                                                <label className="block text-xs font-bold mb-1">Offer Price (₹)</label>
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
                                                <label className="block text-xs font-bold mb-1">Label (e.g. Flash Deal)</label>
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
                                                <label className="block text-xs font-bold mb-1">Start Time</label>
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
                                                <label className="block text-xs font-bold mb-1">End Time</label>
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
                                                        className="w-4 h-4 accent-luxury-gold"
                                                    />
                                                    <span className="text-xs font-bold flex items-center">
                                                        <Clock size={14} className="mr-1" /> This is a Flash Sale
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="customizable"
                                        checked={formData.isCustomizable}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isCustomizable: e.target.checked })
                                        }
                                        className="w-5 h-5 accent-luxury-gold"
                                    />
                                    <label htmlFor="customizable" className="text-sm font-medium">
                                        This product is customizable
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Product Images {!editingProduct && '*'}
                                    </label>
                                    <label className="block cursor-pointer">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-luxury-gold transition-colors">
                                            {uploadingImages ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold mb-2"></div>
                                                    <p className="text-sm text-luxury-gray">Uploading images...</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="mx-auto mb-2 text-luxury-gray" size={32} />
                                                    <p className="text-sm text-luxury-gray">
                                                        Click to upload images or drag and drop
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
                                                <div key={index} className="relative h-24 rounded overflow-hidden">
                                                    <Image
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/placeholder.png';
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 btn-luxury disabled:opacity-50"
                                    >
                                        {submitting
                                            ? 'Saving...'
                                            : editingProduct
                                                ? 'Update Product'
                                                : 'Create Product'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowProductModal(false)}
                                        className="flex-1 btn-outline-luxury"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
