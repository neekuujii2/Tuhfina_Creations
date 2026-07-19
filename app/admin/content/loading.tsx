'use client';

export default function ContentLoading() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" />
                <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">Loading Content...</p>
            </div>
        </div>
    );
}