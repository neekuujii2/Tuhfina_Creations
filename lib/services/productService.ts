import { Product } from '@/lib/types';
import { getCloudinarySignature, deleteCloudinaryImage } from '@/lib/actions/cloudinary';

const uploadToCloudinary = async (file: File | string): Promise<string> => {
    // If it's already a URL, return it
    if (typeof file === 'string' && file.startsWith('http')) {
        return file;
    }

    const { timestamp, signature, cloudName, apiKey } = await getCloudinarySignature();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey!);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
};

const getPublicIdFromUrl = (url: string): string | null => {
    try {
        const splitUrl = url.split('/');
        const filename = splitUrl[splitUrl.length - 1];
        const publicId = filename.split('.')[0];
        return publicId;
    } catch (e) {
        console.error('Error parsing public ID:', e);
        return null;
    }
};

export const productService = {
    // Get all products
    async getAllProducts(): Promise<Product[]> {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const products = await res.json();
        return products.map((p: any) => ({
            ...p,
            id: p._id, // Map MongoDB _id to interface id
            createdAt: new Date(p.createdAt)
        }));
    },

    // Get products by category
    async getProductsByCategory(category: string): Promise<Product[]> {
        const products = await this.getAllProducts();
        return products.filter(p => p.category === category);
    },

    // Get single product
    async getProduct(id: string): Promise<Product | null> {
        const products = await this.getAllProducts();
        return products.find(p => p.id === id) || null;
    },

    // Create product (Admin only)
    async createProduct(
        productData: Omit<Product, 'id' | 'createdAt' | 'images'>,
        imageFiles: (File | string)[]
    ): Promise<string> {
        // Upload images to Cloudinary
        const imageUrls: string[] = [];

        for (const file of imageFiles) {
            const url = await uploadToCloudinary(file);
            imageUrls.push(url);
        }

        // Create product via API
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...productData,
                images: imageUrls,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create product');
        }

        const newProduct = await response.json();
        return newProduct._id;
    },

    // Update product (Admin only)
    async updateProduct(
        id: string,
        productData: Partial<Omit<Product, 'id' | 'createdAt' | 'images'>>,
        newImageFiles?: (File | string)[]
    ): Promise<void> {
        const updateData: any = { ...productData };

        // If new images are provided, upload them
        if (newImageFiles && newImageFiles.length > 0) {
            const imageUrls: string[] = [];

            for (const file of newImageFiles) {
                const url = await uploadToCloudinary(file);
                imageUrls.push(url);
            }

            updateData.images = imageUrls;
        }

        const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            throw new Error('Failed to update product');
        }
    },

    // Delete product (Admin only)
    async deleteProduct(id: string): Promise<void> {
        // Get product to delete images form Cloudinary
        const product = await this.getProduct(id);

        if (product && product.images.length > 0) {
            // Delete images
            for (const imageUrl of product.images) {
                if (typeof imageUrl === 'string' && imageUrl.includes('cloudinary')) {
                    const publicId = getPublicIdFromUrl(imageUrl);
                    if (publicId) await deleteCloudinaryImage(publicId);
                }
            }
        }

        // Delete product via API
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete product');
        }
    },

    // Upload customization image
    async uploadCustomizationImage(file: File): Promise<string> {
        return await uploadToCloudinary(file);
    },
};
