'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, user, isAdmin, loading: authLoading } = useAuth(); // Renamed loading from useAuth to authLoading to avoid conflict
    const router = useRouter();

    // Redirect when user is authenticated
    useEffect(() => {
        if (user && !authLoading) {
            // Redirect based on role
            if (isAdmin) {
                router.replace('/admin');
            } else {
                router.replace('/shop');
            }
        }
    }, [user, isAdmin, authLoading, router]);

    // Prevent flicker
    if (authLoading || (user && !authLoading)) {
        return <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold"></div>
        </div>;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            // Redirect will happen in useEffect when user state updates
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Failed to login. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-luxury-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full animate-scale-in">
                <div className="bg-white rounded-lg shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-luxury-cream rounded-full mb-4">
                            <LogIn className="text-luxury-gold" size={32} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-luxury-black">
                            Welcome Back
                        </h2>
                        <p className="text-luxury-gray mt-2">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2">
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-luxury-black mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-luxury"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-luxury-black mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-luxury"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-luxury disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-luxury-gray">
                            Don&apos;t have an account?{' '}

                            <Link href="/register" className="text-luxury-gold font-semibold hover:text-luxury-darkGold">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
