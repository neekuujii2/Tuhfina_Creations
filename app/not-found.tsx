import Link from 'next/link';
import Image from 'next/image';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-luxury-cream flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <span className="text-8xl font-serif font-bold text-luxury-gold/20">404</span>
                </div>
                <h1 className="text-3xl font-serif font-bold text-primary mb-4">Page Not Found</h1>
                <p className="text-text-secondary mb-8 leading-relaxed">
                    The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to our luxury collections.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/" className="btn-gold px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:scale-105 transition duration-300">
                        <Home size={18} />
                        Back to Home
                    </Link>
                    <button onClick={() => history.back()} className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-8 py-3.5 text-sm font-bold text-primary hover:border-luxury-gold hover:text-luxury-gold transition duration-300">
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
