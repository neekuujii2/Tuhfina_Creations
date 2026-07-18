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

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tuhfina Creation',
    description: 'Luxury handcrafted jewellery and bespoke gifts',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-98735-31273',
        contactType: 'customer service',
        email: 'Tuhfinacreations@gmail.com',
        availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
        'https://instagram.com/tuhfinacreation',
        'https://facebook.com/tuhfinacreation',
        'https://pinterest.com/tuhfinacreation',
        'https://youtube.com/@tuhfinacreation',
        'https://linkedin.com/company/tuhfinacreation',
        'https://wa.me/919873531273',
    ],
};

const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tuhfina Creation',
    description: 'Luxury handcrafted jewellery and bespoke gifts',
    url: baseUrl,
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/shop?category={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
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
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
                />
                <AuthProvider>
                    <CartProvider>
                        <ToastProvider>
                            <Navbar />
                            <main className="min-h-screen pt-[100px]">
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
