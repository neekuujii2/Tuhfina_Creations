export interface Category {
    _id?: string;
    name: string;
    image?: string;
    description?: string;
}

export interface User {
    uid: string;
    email: string;
    role: 'ADMIN' | 'USER';
    createdAt: Date;
}

export interface FestivalOffer {
    price: number;
    startAt: Date;
    endAt: Date;
    label?: string;
    isFlash?: boolean;
}

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    isCustomizable: boolean;
    features?: string[];
    festivalOffer?: FestivalOffer;
    createdAt: Date;
}

export interface CategoryOffer {
    _id?: string;
    category: string;
    discountPercent?: number;
    fixedPrice?: number;
    startAt: Date;
    endAt: Date;
    label?: string;
    isFlash?: boolean;
}

export interface FestivalConfig {
    _id?: string;
    active: boolean;
    bannerText: string;
    bannerSubtext?: string;
    bannerImage?: string;
    startAt: Date;
    endAt: Date;
}

export interface CartItem {
    productId: string;
    quantity: number;
    customization?: {
        text?: string;
        imageUrl?: string;
    };
}

export interface Order {
    id: string;
    userId: string;
    items: {
        productId: string;
        title: string;
        price: number;
        quantity: number;
        imageUrl: string;
        customization?: {
            text?: string;
            imageUrl?: string;
        };
    }[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'CONFIRMED';
    paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    invoiceUrl?: string;
    paidAt?: Date;
    createdAt: Date;
    userEmail?: string;
    shippingAddress?: {
        name: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
        phone: string;
    };
}

export const CATEGORIES = [
    'Artificial Flowers',
    'Real Flowers',
    'Gifts',
    'Customized Earrings',
    'Customized Frames',
    'Customized Keychains',
    'Diwali Diyas & Candles',
] as const;

export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'Tuhfinacreations@gmail.com';
