import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/lib/types';

export const orderService = {
    // Create order
    async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
        const docRef = await addDoc(collection(db, 'orders'), {
            ...orderData,
            createdAt: Timestamp.now(),
        });
        return docRef.id;
    },

    // Get user orders
    async getUserOrders(userId: string): Promise<Order[]> {
        const ordersRef = collection(db, 'orders');
        const q = query(
            ordersRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Order[];
    },

    // Get all orders (Admin only)
    async getAllOrders(): Promise<Order[]> {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Order[];
    },

    // Get single order
    async getOrder(id: string): Promise<Order | null> {
        const docRef = doc(db, 'orders', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
                createdAt: docSnap.data().createdAt?.toDate() || new Date(),
            } as Order;
        }
        return null;
    },

    // Update order status (Admin only)
    async updateOrderStatus(
        id: string,
        status: Order['status']
    ): Promise<void> {
        const docRef = doc(db, 'orders', id);
        await updateDoc(docRef, { status });
    },
};
