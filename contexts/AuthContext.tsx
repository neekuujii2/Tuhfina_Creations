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
    signUp: (email: string, password: string, confirmPassword: string) => Promise<void>;
    verifySignupOtp: (email: string, otp: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isAdmin: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signUp: async () => { },
    verifySignupOtp: async () => { },
    signIn: async () => { },
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
            if (res.ok) {
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

    const signUp = async (email: string, password: string, confirmPassword: string) => {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, confirmPassword }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Signup failed');
        }
    };

    const verifySignupOtp = async (email: string, otp: string) => {
        const res = await fetch('/api/auth/verify-signup-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Verification failed');
        }
    };

    const signIn = async (email: string, password: string) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
            if (data.notVerified) {
                throw new Error('NOT_VERIFIED');
            }
            throw new Error(data.error || 'Login failed');
        }

        if (data.user) {
            setUser({
                ...data.user,
                id: data.user.id,
                uid: data.user.id,
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
        <AuthContext.Provider value={{ user, loading, signUp, verifySignupOtp, signIn, signOut, isAdmin, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}
