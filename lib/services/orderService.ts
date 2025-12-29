import { Order } from '@/lib/types';

export const orderService = {
    // Create order
    async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error('Failed to create order');
        }

        const newOrder = await response.json();
        return newOrder._id;
    },

    // Get user orders
    async getUserOrders(userId: string): Promise<Order[]> {
        const allOrders = await this.getAllOrders();
        return allOrders.filter(order => order.userId === userId);
    },

    // Get all orders (Admin only)
    async getAllOrders(): Promise<Order[]> {
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error('Failed to fetch orders');
        const orders = await res.json();

        return orders.map((o: any) => ({
            ...o,
            id: o._id, // Map MongoDB _id to interface id
            createdAt: new Date(o.createdAt)
        }));
    },

    // Get single order
    async getOrder(id: string): Promise<Order | null> {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error('Failed to fetch order');
        }
        const o = await res.json();
        return {
            ...o,
            id: o._id,
            createdAt: new Date(o.createdAt)
        };
    },

    // Update order status (Admin only)
    async updateOrderStatus(
        id: string,
        status: Order['status']
    ): Promise<void> {
        const response = await fetch(`/api/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Failed to update order status');
        }
    },

    // Update payment status (Admin or Webhook)
    async updatePaymentStatus(
        id: string,
        paymentStatus: Order['paymentStatus']
    ): Promise<void> {
        const response = await fetch(`/api/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentStatus }),
        });

        if (!response.ok) {
            throw new Error('Failed to update payment status');
        }
    },
};
