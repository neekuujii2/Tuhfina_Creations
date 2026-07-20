'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

interface User {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    role: 'ADMIN' | 'USER';
    createdAt: string;
    isVerified?: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signUp: (email: string, password: string, confirmPassword: string, phone?: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isAdmin: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signUp: async () => { },
    signIn: async () => { },
    signOut: async () => { },
    isAdmin: false,
    refreshUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'Tuhfinacreations@gmail.com')
    .split(',')
    .map(e => e.trim().toLowerCase());

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refreshUser = useCallback(async () => {
        try {
            const { data } = await authClient.getSession();
            if (data?.user) {
                const su = data.user as any;
                const email = (su.email || '').toLowerCase();
                setUser({
                    id: su.id || su._id || '',
                    email: su.email || '',
                    name: su.name || '',
                    phone: su.phone || '',
                    role: ADMIN_EMAILS.includes(email) ? 'ADMIN' : (su.role || 'USER'),
                    createdAt: su.createdAt || new Date().toISOString(),
                    isVerified: su.emailVerified || su.isVerified,
                });
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const signUp = useCallback(async (email: string, password: string, _confirmPassword: string, phone?: string) => {
        const { error } = await authClient.signUp.email({
            email,
            password,
            name: email.split('@')[0],
            phone: phone || '',
        } as any);
        if (error) {
            throw new Error(error.message || 'Signup failed');
        }
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        const { error } = await authClient.signIn.email({
            email,
            password,
        });

        if (error) {
            if (error.code === 'EMAIL_NOT_VERIFIED') {
                throw new Error('NOT_VERIFIED');
            }
            throw new Error(error.message || 'Login failed');
        }

        await refreshUser();
    }, [refreshUser]);

    const signOut = useCallback(async () => {
        await authClient.signOut();
        setUser(null);
        router.push('/login');
    }, [router]);

    const isAdmin = user?.role === 'ADMIN';

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, isAdmin, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}
