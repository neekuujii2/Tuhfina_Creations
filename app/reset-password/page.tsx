'use client';

export const dynamic = 'force-dynamic';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Key, ArrowRight, RefreshCcw, CheckCircle, Eye, EyeOff } from 'lucide-react';

function ResetPasswordContent() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const { resetPassword } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError('Missing password reset token. Please request a new link.');
        }
    }, [token]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Missing password reset token. Please request a new link.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            await resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => {
                router.replace('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-[420px]">
                    <div className="bg-white rounded-[20px] border border-black/[0.04] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                            <CheckCircle className="text-green-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-[#111111] mb-3">
                            Password Reset Successful
                        </h2>
                        <p className="text-[#111111]/50 text-sm mb-6 leading-relaxed">
                            Your password has been successfully reset. Redirecting you to login...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[420px]">
                <div className="text-center mb-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b76e79] mb-3">Secure Account</p>
                    <h1 className="text-3xl font-serif font-bold text-[#111111]">Reset Password</h1>
                    <p className="text-[#111111]/50 text-sm mt-2">Enter your new secure password</p>
                </div>

                <div className="bg-white rounded-[20px] border border-black/[0.04] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                            <p className="text-[13px] text-red-600 leading-relaxed">{error}</p>
                        </div>
                    )}

                    {!token ? (
                        <div className="text-center py-4">
                            <Link
                                href="/forgot-password"
                                className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#111111]/90"
                            >
                                Request New Link
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="password" className="block text-[13px] font-semibold text-[#111111] mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111111]/30" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-full border border-black/[0.08] bg-[#f9f9f9] pl-11 pr-12 py-3 text-sm text-[#111111] outline-none transition-all duration-300 focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/10"
                                        placeholder="Min 6 characters"
                                        autoComplete="new-password"
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

                            <div>
                                <label htmlFor="confirmPassword" className="block text-[13px] font-semibold text-[#111111] mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111111]/30" />
                                    <input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full rounded-full border border-black/[0.08] bg-[#f9f9f9] pl-11 pr-4 py-3 text-sm text-[#111111] outline-none transition-all duration-300 focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/10"
                                        placeholder="Repeat new password"
                                        autoComplete="new-password"
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
                                        Reset Password
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-sm text-[#111111]/50 mt-6">
                    Back to{' '}
                    <Link href="/login" className="font-semibold text-[#b76e79] hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#b76e79] border-t-transparent" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
