'use client';

export const dynamic = 'force-dynamic';

import { useState, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Mail, ArrowRight, RefreshCcw, CheckCircle } from 'lucide-react';

function ForgotPasswordContent() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { forgotPassword } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await forgotPassword(email);
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-[420px]">
                    <div className="bg-white rounded-[20px] border border-black/[0.04] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                            <CheckCircle className="text-green-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-[#111111] mb-3">
                            Check Your Email
                        </h2>
                        <p className="text-[#111111]/50 text-sm mb-6 leading-relaxed">
                            If an account exists for this email, a reset link has been sent.
                        </p>
                        <Link
                            href="/login"
                            className="w-full flex items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#111111]/90"
                        >
                            Back to Login
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[420px]">
                <div className="text-center mb-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b76e79] mb-3">Reset Password</p>
                    <h1 className="text-3xl font-serif font-bold text-[#111111]">Forgot Password?</h1>
                    <p className="text-[#111111]/50 text-sm mt-2">Enter your email to receive a password reset link</p>
                </div>

                <div className="bg-white rounded-[20px] border border-black/[0.04] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                            <p className="text-[13px] text-red-600 leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#111111]/90 disabled:opacity-50"
                        >
                            {loading ? (
                                <RefreshCcw className="animate-spin" size={16} />
                            ) : (
                                <>
                                    Send Reset Link
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-[#111111]/50 mt-6">
                    Remember your password?{' '}
                    <Link href="/login" className="font-semibold text-[#b76e79] hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#b76e79] border-t-transparent" />
            </div>
        }>
            <ForgotPasswordContent />
        </Suspense>
    );
}
