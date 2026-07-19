'use client';

export default function AdminLoading() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="flex space-x-3">
                    <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin" />
                    <div className="w-12 h-12 rounded-full border-4 border-accent/30 border-t-transparent animate-spin animation-delay-150" />
                    <div className="w-12 h-12 rounded-full border-4 border-accent/10 border-t-transparent animate-spin animation-delay-300" />
                </div>
                <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">Loading Admin Portal...</p>
            </div>
            <style jsx>{`
                .animation-delay-150 { animation-delay: 150ms; }
                .animation-delay-300 { animation-delay: 300ms; }
            `}</style>
        </div>
    );
}