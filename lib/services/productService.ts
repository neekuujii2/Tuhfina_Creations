import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Product } from '@/lib/types';

export const productService = {
    // Get all products
    async getAllProducts(): Promise<Product[]> {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Product[];
    },

    // Get products by category
    async getProductsByCategory(category: string): Promise<Product[]> {
        const productsRef = collection(db, 'products');
        const q = query(
            productsRef,
            where('category', '==', category),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Product[];
    },

    // Get single product
    async getProduct(id: string): Promise<Product | null> {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
                createdAt: docSnap.data().createdAt?.toDate() || new Date(),
            } as Product;
        }
        return null;
    },

    // Create product (Admin only)
    async createProduct(
        productData: Omit<Product, 'id' | 'createdAt' | 'images'>,
        imageFiles: File[]
    ): Promise<string> {
        // Upload images to Firebase Storage
        const imageUrls: string[] = [];

        for (const file of imageFiles) {
            const timestamp = Date.now();
            const storageRef = ref(storage, `products/${timestamp}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            imageUrls.push(url);
        }

        // Create product document
        const docRef = await addDoc(collection(db, 'products'), {
            ...productData,
            images: imageUrls,
            createdAt: Timestamp.now(),
        });

        return docRef.id;
    },

    // Update product (Admin only)
    async updateProduct(
        id: string,
        productData: Partial<Omit<Product, 'id' | 'createdAt' | 'images'>>,
        newImageFiles?: File[]
    ): Promise<void> {
        const updateData: any = { ...productData };

        // If new images are provided, upload them
        if (newImageFiles && newImageFiles.length > 0) {
            const imageUrls: string[] = [];

            for (const file of newImageFiles) {
                const timestamp = Date.now();
                const storageRef = ref(storage, `products/${timestamp}_${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                imageUrls.push(url);
            }

            updateData.images = imageUrls;
        }

        const docRef = doc(db, 'products', id);
        await updateDoc(docRef, updateData);
    },

    // Delete product (Admin only)
    async deleteProduct(id: string): Promise<void> {
        // Get product to delete images from storage
        const product = await this.getProduct(id);

        if (product && product.images.length > 0) {
            // Delete images from storage
            for (const imageUrl of product.images) {
                try {
                    const imageRef = ref(storage, imageUrl);
                    await deleteObject(imageRef);
                } catch (error) {
                    console.error('Error deleting image:', error);
                }
            }
        }

        // Delete product document
        const docRef = doc(db, 'products', id);
        await deleteDoc(docRef);
    },

    // Upload customization image
    async uploadCustomizationImage(file: File): Promise<string> {
        const timestamp = Date.now();
        const storageRef = ref(storage, `customizations/${timestamp}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return url;
    },
};
