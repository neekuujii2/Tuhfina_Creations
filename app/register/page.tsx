'use client';

export const dynamic = 'force-dynamic';

import { useState, FormEvent, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, AlertCircle, Mail, Key, ArrowRight, RefreshCcw, Eye, EyeOff, CheckCircle, Phone } from 'lucide-react';

function RegisterContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'form' | 'verify-email'>('form');
    const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const { signUp, user, loading: authLoading } = useAuth();
    const router = useRouter();

    const handleResendVerification = async () => {
        setResendStatus('loading');
        try {
            const response = await fetch('/api/custom-verification/resend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                setResendStatus('success');
                setTimeout(() => setResendStatus('idle'), 5000);
            } else {
                setResendStatus('error');
            }
        } catch {
            setResendStatus('error');
        }
    };

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

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!phone.trim()) {
            setError('Mobile number is required');
            return;
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            setError('Please enter a valid 10-digit Indian mobile number');
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, confirmPassword, phone.replace(/\s/g, ''));
            setStep('verify-email');
        } catch (err: any) {
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#b76e79] border-t-transparent" />
            </div>
        );
    }

    if (step === 'verify-email') {
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
                        <p className="text-[#111111]/50 text-sm mb-4">
                            We&apos;ve sent a verification link to
                        </p>
                        <p className="font-semibold text-[#111111] mb-6 bg-[#f9f9f9] rounded-full px-4 py-2.5 inline-block text-sm">
                            {email}
                        </p>
                        <p className="text-[13px] text-[#111111]/50 mb-6 leading-relaxed">
                            Click the link in the email to verify your account. The link expires in 1 hour.
                        </p>

                        <div className="mb-8">
                            {resendStatus === 'success' ? (
                                <p className="text-xs text-green-600 font-semibold bg-green-50 rounded-full px-4 py-2 inline-block">
                                    Verification email resent successfully!
                                </p>
                            ) : resendStatus === 'error' ? (
                                <p className="text-xs text-red-600 font-semibold bg-red-50 rounded-full px-4 py-2 inline-block">
                                    Failed to resend email. Please try again.
                                </p>
                            ) : (
                                <button
                                    onClick={handleResendVerification}
                                    disabled={resendStatus === 'loading'}
                                    className="text-xs font-semibold text-[#b76e79] hover:underline disabled:opacity-50"
                                >
                                    {resendStatus === 'loading' ? 'Resending...' : 'Resend verification email'}
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Link
                                href="/login"
                                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#111111]/90"
                            >
                                Go to Login
                                <ArrowRight size={16} />
                            </Link>
                            <button
                                onClick={() => setStep('form')}
                                className="w-full rounded-full border border-black/[0.08] bg-[#f9f9f9] px-6 py-3.5 text-[13px] font-semibold text-[#111111] transition-all duration-300 hover:border-[#b76e79]/30 hover:text-[#b76e79]"
                            >
                                Use a different email
                            </button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-black/[0.04]">
                            <p className="text-[12px] text-[#111111]/40">
                                Didn&apos;t receive? Check spam folder or{' '}
                                <button onClick={() => setStep('form')} className="text-[#b76e79] font-semibold hover:underline">
                                    try again
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[420px]">
                <div className="text-center mb-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b76e79] mb-3">Join Us</p>
                    <h1 className="text-3xl font-serif font-bold text-[#111111]">Create Account</h1>
                    <p className="text-[#111111]/50 text-sm mt-2">Join Tuhfina Creations today</p>
                </div>

                <div className="bg-white rounded-[20px] border border-black/[0.04] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                            <p className="text-[13px] text-red-600 leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-4">
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
                            <label htmlFor="phone" className="block text-[13px] font-semibold text-[#111111] mb-2">
                                Mobile Number
                            </label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111111]/30" />
                                <input
                                    id="phone"
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    className="w-full rounded-full border border-black/[0.08] bg-[#f9f9f9] pl-11 pr-4 py-3 text-sm text-[#111111] outline-none transition-all duration-300 focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/10"
                                    placeholder="10-digit mobile number"
                                    autoComplete="tel"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-[13px] font-semibold text-[#111111] mb-2">
                                Password
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
                                Confirm Password
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
                                    placeholder="Repeat password"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#111111]/90 disabled:opacity-50 mt-4"
                        >
                            {loading ? (
                                <RefreshCcw className="animate-spin" size={16} />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-[#111111]/50 mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-[#b76e79] hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#b76e79] border-t-transparent" />
            </div>
        }>
            <RegisterContent />
        </Suspense>
    );
}
