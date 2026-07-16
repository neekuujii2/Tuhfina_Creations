import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-accent hover:text-primary rounded-full shadow-soft hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full",
        outline: "border border-border bg-surface text-primary hover:border-accent hover:text-accent rounded-full hover:-translate-y-0.5",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full",
        ghost: "text-text-secondary hover:bg-accent/10 hover:text-accent rounded-2xl",
        link: "text-accent underline-offset-4 hover:underline",
        luxury: "bg-primary text-white rounded-full shadow-soft hover:-translate-y-0.5 hover:bg-accent hover:text-primary border border-transparent",
        'outline-luxury': "border border-border bg-surface text-primary rounded-full hover:-translate-y-0.5 hover:border-accent hover:text-accent",
        'ghost-luxury': "text-text-secondary hover:bg-accent/8 hover:text-accent rounded-2xl",
        gold: "text-white rounded-full shadow-luxury hover:-translate-y-0.5 border border-transparent bg-gradient-to-r from-[#d4af37] via-[#f2d06b] to-[#d4af37] bg-[length:200%_auto] hover:bg-right",
        icon: "rounded-full bg-surface text-primary shadow-soft hover:text-accent hover:shadow-glass",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-12 px-8 py-3",
        xl: "h-14 px-10 py-4 text-base",
        icon: "h-10 w-10",
        'icon-sm': "h-8 w-8",
        'icon-lg': "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
