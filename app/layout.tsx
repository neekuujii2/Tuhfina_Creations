import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/components/ui/toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tuhfina-creations.vercel.app'

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: "Tuhfina Creation | Luxury Jewellery & Gifts",
        template: "%s | Tuhfina Creation"
    },
    description: "Discover Tuhfina Creation's exquisite jewellery, handcrafted gifts, and bespoke treasures designed for modern luxury living.",
    keywords: ["luxury jewellery", "handcrafted gifts", "customized jewelry", "tuhfina creation", "bridal accessories", "premium gifts"],
    authors: [{ name: "Tuhfina Creation" }],
    creator: "Tuhfina Creation",
    publisher: "Tuhfina Creation",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: "Tuhfina Creation | Luxury Jewellery & Gifts",
        description: "Elegant handcrafted jewellery and luxurious gift experiences that celebrate every moment.",
        url: baseUrl,
        siteName: "Tuhfina Creation",
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: "Tuhfina Creation - Luxury Jewellery & Gifts",
            },
        ],
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Tuhfina Creation | Luxury Jewellery & Gifts",
        description: "Elegant jewellery and bespoke gift experiences for modern celebrations.",
        images: ['/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'DpPRz4LZP7_WiEvGlZsRsOiA4rdjWy3leEoVOLQPEF4',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="font-sans antialiased">
                <AuthProvider>
                    <CartProvider>
                        <ToastProvider>
                            <Navbar />
                            <main className="min-h-screen pt-20">
                                {children}
                            </main>
                            <Footer />
                            <WhatsAppFloat />
                        </ToastProvider>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
