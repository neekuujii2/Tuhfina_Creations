import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, Phone, MapPin, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

const footerColumns = [
    { title: 'Products', links: ['Shop All', 'New Arrivals', 'Best Sellers', 'Jewellery'] },
    { title: 'Collections', links: ['Rings', 'Earrings', 'Necklaces', 'Wedding Collection'] },
    { title: 'Company', links: ['About', 'Our Story', 'Careers', 'Contact'] },
];

export default function Footer() {
    return (
        <footer className="border-t border-border bg-primary text-white">
            {/* Trust Badges Bar */}
            <div className="border-b border-white/10 bg-black/30 py-10">
                <div className="section-shell px-4 sm:px-6 lg:px-10 xl:px-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5 text-accent border border-white/10">
                                <ShieldCheck size={22} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wide">100% Secured Payment</h4>
                                <p className="text-xs text-white/50 mt-0.5">Fully protected checkout</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5 text-accent border border-white/10">
                                <Truck size={22} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wide">Free Shipping</h4>
                                <p className="text-xs text-white/50 mt-0.5">On all orders above ₹999</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5 text-accent border border-white/10">
                                <RefreshCw size={22} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wide">Easy Replacements</h4>
                                <p className="text-xs text-white/50 mt-0.5">Friendly customer terms</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5 text-accent border border-white/10">
                                <Award size={22} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wide">Luxury Packaging</h4>
                                <p className="text-xs text-white/50 mt-0.5">Delivered in premium boxes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-shell px-4 py-16 sm:px-6 lg:px-10 xl:px-16">
                <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr]">
                    {/* Brand Section */}
                    <div>
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 overflow-hidden">
                                <Image src="/logo.jpg" alt="Tuhfina Creation logo" width={48} height={48} className="rounded-full object-cover" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">Tuhfina Creation</p>
                                <h3 className="text-lg font-serif font-bold text-white tracking-wide">Luxury, crafted with care</h3>
                            </div>
                        </Link>
                        <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/65">
                            Discover elegant jewellery, bespoke gifting, and premium collections designed to celebrate the extraordinary.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 p-3 text-white/80 transition hover:border-accent hover:text-accent hover:bg-white/5"><Instagram size={18} /></a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 p-3 text-white/80 transition hover:border-accent hover:text-accent hover:bg-white/5"><Facebook size={18} /></a>
                        </div>
                    </div>

                    {/* Columns */}
                    {footerColumns.map((column) => (
                        <div key={column.title}>
                            <h4 className="text-xs font-bold uppercase tracking-[0.24em] text-accent mb-6">{column.title}</h4>
                            <ul className="space-y-4 text-sm text-white/65">
                                {column.links.map((link) => (
                                    <li key={link}>
                                        <Link href="/shop" className="transition hover:text-white hover:underline">{link}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Customer Care */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.24em] text-accent mb-6">Customer Care</h4>
                        <ul className="space-y-4 text-sm text-white/65">
                            <li className="flex items-start gap-2.5">
                                <Mail size={16} className="mt-0.5 text-accent shrink-0" />
                                <span className="break-all">Tuhfinacreations@gmail.com</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <Phone size={16} className="mt-0.5 text-accent shrink-0" />
                                <span>+91 9873531273</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <MapPin size={16} className="mt-0.5 text-accent shrink-0" />
                                <span>India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Legal bar */}
                <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} Tuhfina Creation. All rights reserved.</p>
                    <div className="flex flex-wrap gap-6">
                        <Link href="/" className="transition hover:text-white">Privacy Policy</Link>
                        <Link href="/" className="transition hover:text-white">Terms of Service</Link>
                        <Link href="/" className="transition hover:text-white">Designed with ❤️ by Tuhfina Creation</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
