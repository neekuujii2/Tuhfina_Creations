import type { Config } from "tailwindcss";

const config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                serif: ['var(--font-serif)', 'Georgia', 'serif'],
                sans: ['var(--font-sans)', 'sans-serif'],
            },
            colors: {
                background: 'var(--color-background)',
                surface: 'var(--color-surface)',
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    foreground: 'var(--color-surface)',
                },
                secondary: {
                    DEFAULT: 'var(--color-secondary)',
                    foreground: 'var(--color-surface)',
                },
                accent: {
                    DEFAULT: 'var(--color-accent)',
                    foreground: 'var(--color-surface)',
                },
                border: 'var(--color-border)',
                'text-primary': 'var(--color-text-primary)',
                'text-secondary': 'var(--color-text-secondary)',
                success: 'var(--color-success)',
                error: 'var(--color-error)',
                luxury: {
                    gold: 'var(--color-premium-gold)',
                    roseGold: 'var(--color-accent)',
                    cream: 'var(--color-soft-pink)',
                    black: '#111111',
                    gray: 'var(--color-light-gray)',
                    warm: 'var(--color-warm-ivory)',
                },
                // Shadcn UI Specific
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                foreground: "hsl(var(--foreground))",
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            boxShadow: {
                soft: '0 20px 60px rgba(17, 17, 17, 0.08)',
                premium: '0 32px 90px rgba(17, 17, 17, 0.12)',
                glass: '0 8px 32px rgba(17, 17, 17, 0.06)',
                luxury: '0 24px 80px rgba(212, 175, 55, 0.10)',
                glow: '0 0 40px rgba(183, 110, 121, 0.15)',
                'card-hover': '0 28px 70px rgba(17, 17, 17, 0.14)',
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            },
            backdropBlur: {
                xs: '2px',
                '2xl': '40px',
                '3xl': '64px',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'fade-in-up': 'fadeInUp 0.7s ease-out',
                'slide-up': 'slideUp 0.7s ease-out',
                'slide-in-right': 'slideInRight 0.5s ease-out',
                'scale-in': 'scaleIn 0.45s ease-out',
                float: 'float 5s ease-in-out infinite',
                'float-slow': 'float 7s ease-in-out infinite',
                shimmer: 'shimmer 2s linear infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(183, 110, 121, 0.1)' },
                    '50%': { boxShadow: '0 0 40px rgba(183, 110, 121, 0.25)' },
                },
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
