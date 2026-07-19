'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function ReportsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => { console.error('Reports Error:', error); }, [error]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-serif font-bold text-primary mb-2">Something went wrong</h1>
                <p className="text-text-secondary text-sm mb-8">We encountered an unexpected error while loading reports.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="luxury" onClick={reset} className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> Try Again</Button>
                    <Button variant="outline-luxury" onClick={() => window.location.href = '/admin/reports'}>Reload Page</Button>
                </div>
            </div>
        </div>
    );
}