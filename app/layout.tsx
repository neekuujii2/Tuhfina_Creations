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

export const metadata: Metadata = {
    title: "Tuhfina Creation - Handcrafted Luxury Gifts",
    description: "Discover exquisite handcrafted and customized gifts, artificial and real flower bouquets, personalized earrings, frames, keychains, and festive Diwali diyas & candles.",
    keywords: "handcrafted gifts, customized gifts, flower bouquets, personalized earrings, custom frames, keychains, Diwali diyas, luxury gifts",
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
