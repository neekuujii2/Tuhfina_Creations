'use client';

export function StatCardSkeleton() {
    return (
        <div className="bg-white border border-border rounded-[24px] p-6 shadow-soft relative overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-3 w-24 bg-luxury-gray/20 rounded-full animate-pulse" />
                    <div className="h-8 w-16 bg-luxury-gray/30 rounded-lg animate-pulse" />
                </div>
                <div className="h-12 w-12 rounded-full bg-luxury-gray/20 animate-pulse" />
            </div>
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-luxury-gray/10" />
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-soft">
            <div className="h-44 w-full bg-luxury-gray/20 animate-pulse" />
            <div className="p-5 space-y-3">
                <div className="h-3 w-20 bg-luxury-gray/20 rounded-full animate-pulse" />
                <div className="h-5 w-3/4 bg-luxury-gray/30 rounded-lg animate-pulse" />
                <div className="h-3 w-full bg-luxury-gray/10 rounded-lg animate-pulse" />
                <div className="h-3 w-2/3 bg-luxury-gray/10 rounded-lg animate-pulse" />
                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="h-6 w-16 bg-luxury-gray/30 rounded-lg animate-pulse" />
                    <div className="h-6 w-20 bg-luxury-gray/20 rounded-full animate-pulse" />
                </div>
                <div className="flex gap-2">
                    <div className="flex-1 h-9 bg-luxury-gray/20 rounded-xl animate-pulse" />
                    <div className="flex-1 h-9 bg-luxury-gray/20 rounded-xl animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export function OrderRowSkeleton() {
    return (
        <div className="bg-white border border-border rounded-2xl p-6 shadow-soft space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-border pb-5">
                <div className="space-y-2">
                    <div className="h-3 w-24 bg-luxury-gray/20 rounded-full animate-pulse" />
                    <div className="h-4 w-32 bg-luxury-gray/30 rounded-lg animate-pulse" />
                    <div className="h-3 w-48 bg-luxury-gray/10 rounded-lg animate-pulse" />
                </div>
                <div className="flex items-center gap-4">
                    <div className="space-y-1">
                        <div className="h-3 w-20 bg-luxury-gray/20 rounded-full animate-pulse" />
                        <div className="h-6 w-24 bg-luxury-gray/30 rounded-lg animate-pulse" />
                    </div>
                    <div className="h-10 w-32 bg-luxury-gray/20 rounded-full animate-pulse" />
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <div className="h-3 w-24 bg-luxury-gray/20 rounded-full animate-pulse" />
                    <div className="h-3 w-full bg-luxury-gray/10 rounded-lg animate-pulse" />
                    <div className="h-3 w-3/4 bg-luxury-gray/10 rounded-lg animate-pulse" />
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-24 bg-luxury-gray/20 rounded-full animate-pulse" />
                    <div className="h-3 w-full bg-luxury-gray/10 rounded-lg animate-pulse" />
                    <div className="h-3 w-2/3 bg-luxury-gray/10 rounded-lg animate-pulse" />
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-24 bg-luxury-gray/20 rounded-full animate-pulse" />
                    <div className="h-3 w-full bg-luxury-gray/10 rounded-lg animate-pulse" />
                    <div className="h-3 w-1/2 bg-luxury-gray/10 rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export function CategoryCardSkeleton() {
    return (
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col items-center shadow-soft">
            <div className="h-32 w-full mb-4 bg-luxury-gray/20 rounded-xl animate-pulse" />
            <div className="h-5 w-32 bg-luxury-gray/30 rounded-lg animate-pulse mb-4" />
            <div className="h-9 w-full bg-luxury-gray/20 rounded-full animate-pulse" />
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="bg-white border border-border rounded-[28px] p-6 shadow-soft space-y-4">
            <div className="h-6 w-48 bg-luxury-gray/20 rounded-lg animate-pulse" />
            <div className="h-[300px] w-full bg-luxury-gray/10 rounded-xl animate-pulse" />
        </div>
    );
}
