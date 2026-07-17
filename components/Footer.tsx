import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const footerColumns = [
    { title: 'Shop', links: [{ name: 'All Products', href: '/shop' }, { name: 'New Arrivals', href: '/shop?sort=newest' }, { name: 'Best Sellers', href: '/shop' }] },
    { title: 'Company', links: [{ name: 'About', href: '/about' }, { name: 'Our Story', href: '/our-story' }, { name: 'Contact', href: '/contact' }] },
];

export default function Footer() {
    return (
        <footer className="border-t border-border bg-background text-primary">
            <div className="section-shell px-4 py-16 sm:px-6 lg:px-10 xl:px-16">
                <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
                    {/* Brand Section */}
                    <div>
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface overflow-hidden">
                                <Image src="/logo.jpg" alt="Tuhfina Creation logo" width={48} height={48} className="rounded-full object-cover" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-text-secondary">Tuhfina Creation</p>
                                <h3 className="text-lg font-serif font-bold text-primary tracking-wide">Luxury, crafted with care</h3>
                            </div>
                        </Link>
                        <p className="mt-6 max-w-sm text-sm leading-relaxed text-text-secondary">
                            Discover elegant jewellery, bespoke gifting, and premium collections designed to celebrate the extraordinary.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="rounded-full border border-border bg-surface p-3 text-text-secondary transition hover:border-luxury-gold hover:text-accent hover:bg-luxury-warm/40"><Instagram size={18} /></a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="rounded-full border border-border bg-surface p-3 text-text-secondary transition hover:border-luxury-gold hover:text-accent hover:bg-luxury-warm/40"><Facebook size={18} /></a>
                        </div>
                    </div>

                    {/* Columns */}
                    {footerColumns.map((column) => (
                        <div key={column.title}>
                            <h4 className="text-xs font-bold uppercase tracking-[0.24em] text-accent mb-6">{column.title}</h4>
                            <ul className="space-y-4 text-sm text-text-secondary">
                                {column.links.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="transition hover:text-primary hover:underline">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Customer Care */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.24em] text-accent mb-6">Customer Care</h4>
                        <ul className="space-y-4 text-sm text-text-secondary">
                            <li className="flex items-start gap-2.5">
                                <Mail size={16} className="mt-0.5 text-accent shrink-0" />
                                <a href="mailto:Tuhfinacreations@gmail.com" className="break-all hover:text-primary transition">Tuhfinacreations@gmail.com</a>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <Phone size={16} className="mt-0.5 text-accent shrink-0" />
                                <a href="tel:+919873531273" className="hover:text-primary transition">+91 98735 31273</a>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <MapPin size={16} className="mt-0.5 text-accent shrink-0" />
                                <span>India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Legal bar */}
                <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} Tuhfina Creation. All rights reserved.</p>
                    <div className="flex flex-wrap gap-6">
                        <Link href="/" className="transition hover:text-primary">Privacy Policy</Link>
                        <Link href="/" className="transition hover:text-primary">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
