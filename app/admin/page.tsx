'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { productService } from '@/lib/services/productService';
import { orderService } from '@/lib/services/orderService';
import { Product, Order, CATEGORIES } from '@/lib/types';
// import Image from 'next/image'; // Removed as per requirement
import {
    Plus,
    Package,
    ShoppingBag,
    Edit,
    Trash2,
    X,
    Upload,
    AlertCircle,
} from 'lucide-react';

export default function AdminDashboard() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
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
    }>({
        title: '',
        description: '',
        price: '',
        category: CATEGORIES[0],
        isCustomizable: false,
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [csvProcessing, setCsvProcessing] = useState(false);
    const [csvProgress, setCsvProgress] = useState({ current: 0, total: 0 });

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
    }, [user, isAdmin, authLoading]);

    const loadData = async () => {
        setPageLoading(true);
        try {
            const [productsData, ordersData] = await Promise.all([
                productService.getAllProducts(),
                orderService.getAllOrders(),
            ]);
            setProducts(productsData);
            setOrders(ordersData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setPageLoading(false);
        }
    };

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
                <div className="mb-12">
                    <h1 className="text-4xl font-serif font-bold text-luxury-black mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-luxury-gray">Manage products and orders</p>
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
                                            <img
                                                src={product.images[0]}
                                                alt={product.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/placeholder.png';
                                                }}
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

                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="customizable"
                                        checked={formData.isCustomizable}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isCustomizable: e.target.checked })
                                        }
                                        className="w-5 h-5"
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
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-full object-cover"
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
