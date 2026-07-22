import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function VerifyEmailSuccessPage() {
    return (
        <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[420px]">
                <div className="bg-white rounded-[20px] border border-black/[0.04] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                        <CheckCircle className="text-green-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-[#111111] mb-3">
                        Verification Successful
                    </h2>
                    <p className="text-[#111111]/50 text-[15px] mb-8 leading-relaxed">
                        Your account has been successfully verified. You can now log in and explore our collection.
                    </p>

                    <Link
                        href="/login"
                        className="w-full flex items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#111111]/90"
                    >
                        Go to Login
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
