'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, AlertCircle, AlertTriangle, Mail, Key, ArrowRight, RefreshCcw, Eye, EyeOff } from 'lucide-react';

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [notVerifiedInfo, setNotVerifiedInfo] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, user, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Determine redirect path
    const redirectPath = searchParams.get('redirect') || (isAdmin ? '/admin' : '/shop');

    // Redirect when user is already authenticated
    useEffect(() => {
        if (!authLoading && user) {
            router.replace(redirectPath);
        }
    }, [user, authLoading, router, redirectPath]);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            // Redirection will be handled by the useEffect above once user state updates
        } catch (err: any) {
            if (err.message === 'NOT_VERIFIED') {
                // Auto-request a fresh OTP before redirecting to verify page
                try {
                    await fetch('/api/auth/request-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email }),
                    });
                } catch {
                    // Non-critical: redirect even if resend fails
                }
                router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
            } else {
                setError(err.message || 'Invalid credentials. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Prevent rendering form if authenticated - avoids flicker before redirect
    if (authLoading || user) {
        return (
            <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-luxury-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-luxury-gold/10">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-luxury-cream rounded-full mb-4">
                            <LogIn className="text-luxury-gold" size={32} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-luxury-black">
                            Welcome Back
                        </h2>
                        <p className="text-luxury-gray mt-2">
                            Sign in to your account
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-luxury-black mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray/40 group-focus-within:text-luxury-gold transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-luxury pl-12"
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-luxury-black mb-2">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray/40 group-focus-within:text-luxury-gold transition-colors">
                                    <Key size={18} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-luxury pl-12 pr-12"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-gray hover:text-luxury-black transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-luxury flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <RefreshCcw className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-luxury-cream text-center">
                        <p className="text-sm text-luxury-gray">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-luxury-gold font-semibold hover:text-luxury-darkGold">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-luxury-cream flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold"></div></div>}>
            <LoginContent />
        </Suspense>
    );
}
