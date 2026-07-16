import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

const badgeVariants = cva(
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-all",
    {
        variants: {
            variant: {
                default: "bg-primary text-white",
                secondary: "bg-surface text-text-secondary border border-border",
                accent: "bg-accent text-white",
                gold: "bg-gradient-to-r from-[#d4af37] to-[#f2d06b] text-primary",
                success: "bg-success/10 text-success",
                error: "bg-error/10 text-error",
                flash: "bg-red-600 text-white animate-pulse-glow",
                sale: "bg-gradient-to-r from-[#d4af37] to-[#b76e79] text-white",
                new: "bg-primary text-white",
                custom: "bg-primary/80 text-white backdrop-blur-sm",
                outline: "bg-transparent border border-border text-text-secondary",
            },
            size: {
                sm: "px-2 py-0.5 text-[10px]",
                default: "px-3 py-1 text-[11px]",
                lg: "px-4 py-1.5 text-xs",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
    children: ReactNode;
    className?: string;
    icon?: ReactNode;
}

export function Badge({ children, variant, size, className, icon }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant, size }), className)}>
            {icon}
            {children}
        </span>
    );
}

export { badgeVariants };
