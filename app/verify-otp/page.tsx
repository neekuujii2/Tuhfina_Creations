'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, AlertCircle, Key, RefreshCcw } from 'lucide-react';

function VerifyOtpContent() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { verifySignupOtp, user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            router.replace('/shop');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!email && !authLoading && !user) {
            router.replace('/register');
        }
    }, [email, router, authLoading, user]);

    const handleVerify = async (e: FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setError('');
        setLoading(true);

        try {
            await verifySignupOtp(email, otp);
            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || (user && !success)) {
        return (
            <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold"></div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-luxury-cream flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-2xl p-8 border border-luxury-gold/10">
                    <div className="inline-block p-4 bg-green-50 rounded-full mb-4">
                        <ShieldCheck className="text-green-500" size={32} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-luxury-black">Verified!</h2>
                    <p className="text-luxury-gray mt-2">
                        Your email has been verified successfully. Redirecting to login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-luxury-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-luxury-gold/10">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-luxury-cream rounded-full mb-4">
                            <Key className="text-luxury-gold" size={32} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-luxury-black">
                            Verify OTP
                        </h2>
                        <p className="text-luxury-gray mt-2">
                            Enter the 6-digit code sent to <br />
                            <span className="font-semibold text-luxury-black">{email}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray/40 group-focus-within:text-luxury-gold transition-colors">
                                    <Key size={18} />
                                </div>
                                <input
                                    id="otp"
                                    type="text"
                                    maxLength={6}
                                    required
                                    autoFocus
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="input-luxury pl-12 tracking-[0.5em] font-mono text-center text-2xl"
                                    placeholder="000000"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full btn-luxury flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <RefreshCcw className="animate-spin" size={20} />
                            ) : (
                                <span>Verify Email</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-luxury-cream text-center text-sm text-luxury-gray">
                        Didn&apos;t receive the code? Check your spam folder or try signing up again.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-luxury-cream flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold"></div></div>}>
            <VerifyOtpContent />
        </Suspense>
    );
}
