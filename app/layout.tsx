import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: '--font-playfair',
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tuhfina-creations.vercel.app'

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: "Tuhfina Creation | Handcrafted Luxury Gifts & Decor",
        template: "%s | Tuhfina Creation"
    },
    description: "Discover Tuhfina Creation's exquisite handcrafted and customized gifts. We offer artificial and real flower bouquets, personalized earrings, custom frames, keychains, and festive Diwali diyas & candles. Unique treasures for every occasion.",
    keywords: ["handcrafted gifts", "customized gifts", "tuhfina creation", "flower bouquets", "personalized jewelry", "custom frames", "Diwali gifts", "luxury handmade decor"],
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
        title: "Tuhfina Creation | Handcrafted Luxury Gifts",
        description: "Exquisite handcrafted gifts, personalized jewelry, and luxury home decor. Discover unique treasures at Tuhfina Creation.",
        url: baseUrl,
        siteName: "Tuhfina Creation",
        images: [
            {
                url: '/og-image.jpg', // Make sure to add this image to /public
                width: 1200,
                height: 630,
                alt: "Tuhfina Creation - Handcrafted Luxury Gifts",
            },
        ],
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Tuhfina Creation | Handcrafted Luxury Gifts",
        description: "Exquisite handcrafted gifts and personalized treasures. Shop luxury decor and unique gift items.",
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
        google: 'DpPRz4LZP7_WiEvGlZsRsOiA4rdjWy3leEoVOLQPEF4', // User needs to replace this
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${playfair.variable} antialiased`}>
                <AuthProvider>
                    <CartProvider>
                        <Navbar />
                        <main className="min-h-screen">
                            {children}
                        </main>
                        <Footer />
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
