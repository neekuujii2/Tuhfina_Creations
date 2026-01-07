'use client';

import { useState, FormEvent, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, AlertCircle, Mail, Key, ArrowRight, RefreshCcw, Eye, EyeOff } from 'lucide-react';

function RegisterContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signUp, user, loading: authLoading } = useAuth();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            router.replace('/shop');
        }
    }, [user, authLoading, router]);

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, confirmPassword);
            router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                            <UserPlus className="text-luxury-gold" size={32} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-luxury-black">
                            Create Account
                        </h2>
                        <p className="text-luxury-gray mt-2">
                            Join Tuhfina Creations today
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-luxury-black mb-1">
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
                            <label htmlFor="password" className="block text-sm font-medium text-luxury-black mb-1">
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
                                    placeholder="Create a password"
                                    autoComplete="new-password"
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

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-luxury-black mb-1">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray/40 group-focus-within:text-luxury-gold transition-colors">
                                    <Key size={18} />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-luxury pl-12"
                                    placeholder="Repeat your password"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-luxury flex items-center justify-center space-x-2 disabled:opacity-50 mt-6"
                        >
                            {loading ? (
                                <RefreshCcw className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-luxury-cream text-center">
                        <p className="text-sm text-luxury-gray">
                            Already have an account?{' '}
                            <Link href="/login" className="text-luxury-gold font-semibold hover:text-luxury-darkGold">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-luxury-cream flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold"></div></div>}>
            <RegisterContent />
        </Suspense>
    );
}
