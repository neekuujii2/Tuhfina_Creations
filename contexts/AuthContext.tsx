'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    uid: string;
    email: string;
    name?: string;
    role: 'ADMIN' | 'USER';
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    requestOtp: (email: string) => Promise<void>;
    verifyOtp: (email: string, otp: string, name?: string) => Promise<void>;
    signOut: () => Promise<void>;
    isAdmin: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    requestOtp: async () => { },
    verifyOtp: async () => { },
    signOut: async () => { },
    isAdmin: false,
    refreshUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refreshUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            if (data.user) {
                setUser({
                    ...data.user,
                    id: data.user._id,
                    uid: data.user._id,
                });
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error refreshing user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const requestOtp = async (email: string) => {
        const res = await fetch('/api/auth/request-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Failed to request OTP');
        }
    };

    const verifyOtp = async (email: string, otp: string, name?: string) => {
        const res = await fetch('/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, name }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Failed to verify OTP');
        }

        if (data.user) {
            setUser({
                ...data.user,
                id: data.user._id,
                uid: data.user._id,
            });
        }
    };

    const signOut = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/login');
    };

    const isAdmin = user?.role === 'ADMIN';

    return (
        <AuthContext.Provider value={{ user, loading, requestOtp, verifyOtp, signOut, isAdmin, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}
