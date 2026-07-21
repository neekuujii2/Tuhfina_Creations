'use client';

export const dynamic = 'force-dynamic';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, AlertCircle, Mail, Key, ArrowRight, RefreshCcw, Eye, EyeOff, CheckCircle } from 'lucide-react';

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, user, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirectPath = searchParams.get('redirect') || (isAdmin ? '/admin' : '/shop');

    if (!authLoading && user) {
        router.replace(redirectPath);
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#b76e79] border-t-transparent" />
            </div>
        );
    }

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            router.replace(redirectPath);
        } catch (err: any) {
            if (err.message === 'NOT_VERIFIED') {
                setError('Please verify your email first. Check your inbox for the verification link.');
            } else {
                setError(err.message || 'Invalid credentials. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[420px]">
                <div className="text-center mb-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b76e79] mb-3">Welcome Back</p>
                    <h1 className="text-3xl font-serif font-bold text-[#111111]">Sign In</h1>
                    <p className="text-[#111111]/50 text-sm mt-2">Access your Tuhfina Creation account</p>
                </div>

                <div className="bg-white rounded-[20px] border border-black/[0.04] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                            <p className="text-[13px] text-red-600 leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-[13px] font-semibold text-[#111111] mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111111]/30" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-full border border-black/[0.08] bg-[#f9f9f9] pl-11 pr-4 py-3 text-sm text-[#111111] outline-none transition-all duration-300 focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/10"
                                    placeholder="your@email.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="password" className="block text-[13px] font-semibold text-[#111111]">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-xs font-semibold text-[#b76e79] hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111111]/30" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-full border border-black/[0.08] bg-[#f9f9f9] pl-11 pr-12 py-3 text-sm text-[#111111] outline-none transition-all duration-300 focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/10"
                                    placeholder="Enter password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#111111]/30 hover:text-[#111111]/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#111111]/90 disabled:opacity-50"
                        >
                            {loading ? (
                                <RefreshCcw className="animate-spin" size={16} />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-[#111111]/50 mt-6">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-semibold text-[#b76e79] hover:underline">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#b76e79] border-t-transparent" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
