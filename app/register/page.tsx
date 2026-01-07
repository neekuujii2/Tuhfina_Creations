'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, AlertCircle, Mail, Key, User, ArrowRight, RefreshCcw } from 'lucide-react';

function RegisterContent() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'details' | 'otp'>('details');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [expiryTimer, setExpiryTimer] = useState(300);

    const { requestOtp, verifyOtp, user, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || (isAdmin ? '/admin' : '/shop');

    // Redirect when user is authenticated
    useEffect(() => {
        if (user && !authLoading) {
            router.replace(redirect);
        }
    }, [user, isAdmin, authLoading, router, redirect]);

    // Resend timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendDisabled && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            setResendDisabled(false);
        }
        return () => clearInterval(interval);
    }, [resendDisabled, resendTimer]);

    // Expiry timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 'otp' && expiryTimer > 0) {
            interval = setInterval(() => {
                setExpiryTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, expiryTimer]);

    const handleRequestOtp = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await requestOtp(email);
            setStep('otp');
            setResendDisabled(true);
            setResendTimer(60);
            setExpiryTimer(300);
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await verifyOtp(email, otp, name);
            // Redirect happens in useEffect
        } catch (err: any) {
            setError(err.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendDisabled) return;
        setError('');
        setLoading(true);

        try {
            await requestOtp(email);
            setResendDisabled(true);
            setResendTimer(60);
            setExpiryTimer(300);
            setOtp('');
        } catch (err: any) {
            setError(err.message || 'Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (authLoading || (user && !authLoading)) {
        return (
            <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-luxury-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full animate-scale-in">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-luxury-gold/10">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-luxury-cream rounded-full mb-4">
                            <UserPlus className="text-luxury-gold" size={32} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-luxury-black">
                            {step === 'details' ? 'Create Account' : 'Verify Email'}
                        </h2>
                        <p className="text-luxury-gray mt-2">
                            {step === 'details'
                                ? 'Join Tuhfina Creations today'
                                : `We've sent a code to ${email}`}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 animate-shake">
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {step === 'details' ? (
                        <form onSubmit={handleRequestOtp} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-luxury-black mb-2">
                                    Full Name (Optional)
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gray" size={18} />
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input-luxury pl-10"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-luxury-black mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gray" size={18} />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-luxury pl-10"
                                        placeholder="you@example.com"
                                    />
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
                                        <span>Create & Send Code</span>
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="otp" className="block text-sm font-medium text-luxury-black">
                                        Verification Code
                                    </label>
                                    <span className={`text-xs font-medium ${expiryTimer < 60 ? 'text-red-500 animate-pulse' : 'text-luxury-gray'}`}>
                                        Expires in {formatTime(expiryTimer)}
                                    </span>
                                </div>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gray" size={18} />
                                    <input
                                        id="otp"
                                        type="text"
                                        maxLength={6}
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="input-luxury pl-10 tracking-[1em] font-mono text-center text-xl"
                                        placeholder="000000"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6 || expiryTimer === 0}
                                className="w-full btn-luxury disabled:opacity-50"
                            >
                                {loading ? 'Verifying...' : 'Verify & Sign Up'}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendDisabled || loading}
                                    className="text-sm font-semibold text-luxury-gold hover:text-luxury-darkGold disabled:text-luxury-gray transition-colors"
                                >
                                    {resendDisabled
                                        ? `Resend code in ${resendTimer}s`
                                        : 'Didn\'t receive a code? Resend'}
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep('details')}
                                className="w-full text-sm text-luxury-gray hover:text-luxury-black transition-colors"
                            >
                                Change details
                            </button>
                        </form>
                    )}

                    <div className="mt-8 pt-8 border-t border-luxury-cream text-center">
                        <p className="text-sm text-luxury-gray">
                            Already have an account?{' '}
                            <Link href="/login" className="text-luxury-gold font-semibold hover:text-luxury-darkGold">
                                Sign in
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
