'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    Facebook,
    Instagram,
    Mail,
    Phone,
    MapPin,
    Clock,
    Youtube,
    Linkedin,
    MessageCircle,
    CreditCard,
    Smartphone,
    Wallet,
    ShieldCheck,
} from 'lucide-react';

type FooterLink = { name: string; href: string };

type FooterColumn = { title: string; links: FooterLink[] };

const quickLinks: FooterColumn = {
    title: 'Quick Links',
    links: [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: 'Collections', href: '/shop' },
        { name: 'About', href: '/about' },
        { name: 'Our Story', href: '/our-story' },
        { name: 'Contact', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
    ],
};

const policies: FooterColumn = {
    title: 'Customer Service',
    links: [
        { name: 'Shipping', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms & Conditions', href: '/terms' },
    ],
};

const paymentMethods = [
    { name: 'Visa', label: 'Visa' },
    { name: 'Mastercard', label: 'Mastercard' },
    { name: 'UPI', label: 'UPI' },
    { name: 'Razorpay', label: 'Razorpay' },
];

const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/tuhfinacreation' },
    { name: 'Facebook', href: 'https://facebook.com/tuhfinacreation' },
    { name: 'Pinterest', href: 'https://pinterest.com/tuhfinacreation' },
    { name: 'YouTube', href: 'https://youtube.com/@tuhfinacreation' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/tuhfinacreation' },
    { name: 'WhatsApp', href: 'https://wa.me/919873531273' },
];

const linkHover =
    'transition-all duration-300 hover:text-primary hover:translate-x-1 inline-block';

function SocialIcon({ name, href }: { name: string; href: string }) {
    const iconClass = 'rounded-full border border-border bg-surface p-3 text-text-secondary shadow-soft transition-all duration-300 hover:border-luxury-gold hover:bg-luxury-warm/50 hover:text-luxury-gold hover:-translate-y-1 inline-flex';

    if (name === 'Instagram') {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className={iconClass}>
                <Instagram size={18} />
            </a>
        );
    }
    if (name === 'Facebook') {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className={iconClass}>
                <Facebook size={18} />
            </a>
        );
    }
    if (name === 'Pinterest') {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className={iconClass}>
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
            </a>
        );
    }
    if (name === 'YouTube') {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className={iconClass}>
                <Youtube size={18} />
            </a>
        );
    }
    if (name === 'LinkedIn') {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className={iconClass}>
                <Linkedin size={18} />
            </a>
        );
    }
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className={iconClass}>
            <MessageCircle size={18} />
        </a>
    );
}

function PaymentBadge({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-secondary shadow-soft transition-colors duration-300 hover:border-luxury-gold hover:text-luxury-gold">
            <CreditCard size={16} className="text-luxury-gold" />
            {label}
        </div>
    );
}

function FooterColumnList({ column, index }: { column: FooterColumn; index: number }) {
    return (
        <div style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}>
            <h4 className="text-xs font-bold uppercase tracking-[0.24em] text-accent mb-6">{column.title}</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
                {column.links.map((link) => (
                    <li key={link.name}>
                        <Link href={link.href} className={linkHover}>{link.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-border bg-background text-primary">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-premium-gold) 1px, transparent 0)',
                    backgroundSize: '22px 22px',
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-luxury-gold/10 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-luxury-warm/60 blur-3xl"
            />

            <div className="section-shell relative px-4 py-16 sm:px-6 lg:px-10 xl:px-16">
                <div className="luxury-divider mb-14" />

                <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
                    <div>
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-luxury-gold/40 bg-surface shadow-soft overflow-hidden">
                                <Image src="/logo.png" alt="Tuhfina Creation logo" width={48} height={48} className="rounded-full object-cover" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold">Tuhfina Creation</p>
                                <h3 className="text-lg font-serif font-bold text-primary tracking-wide">Luxury, crafted with care</h3>
                            </div>
                        </Link>
                        <p className="mt-2 text-xs font-serif italic tracking-wide text-luxury-gold/90">
                            Crafted with Love, Designed for You
                        </p>
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-secondary">
                            Discover elegant jewellery, bespoke gifting, and premium collections designed to celebrate the extraordinary.
                        </p>

                        <div className="mt-7">
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-accent">Follow Us</p>
                            <div className="flex flex-wrap gap-3">
                                {socialLinks.map((social) => (
                                    <SocialIcon key={social.name} name={social.name} href={social.href} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <FooterColumnList column={quickLinks} index={1} />
                    <FooterColumnList column={policies} index={2} />

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.24em] text-accent mb-6">Customer Care</h4>
                        <ul className="space-y-4 text-sm text-text-secondary">
                            <li className="flex items-start gap-2.5">
                                <Mail size={16} className="mt-0.5 text-luxury-gold shrink-0" />
                                <a href="mailto:Tuhfinacreations@gmail.com" className="break-all transition hover:text-primary">Tuhfinacreations@gmail.com</a>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <Phone size={16} className="mt-0.5 text-luxury-gold shrink-0" />
                                <a href="tel:+919873531273" className="transition hover:text-primary">+91 98735 31273</a>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <MapPin size={16} className="mt-0.5 text-luxury-gold shrink-0" />
                                <span>India</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <Clock size={16} className="mt-0.5 text-luxury-gold shrink-0" />
                                <span>Mon-Sat: 10:00 AM - 7:00 PM</span>
                            </li>
                        </ul>

                        <h4 className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-accent mb-4">Payment Methods</h4>
                        <div className="flex flex-wrap gap-2.5">
                            {paymentMethods.map((method) => (
                                <PaymentBadge key={method.name} label={method.label} />
                            ))}
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-[11px] text-text-secondary">
                            <ShieldCheck size={14} className="text-luxury-gold" />
                            <span>Secure payments via Razorpay</span>
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center gap-4 border-t border-border pt-8 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} Tuhfina Creation. All rights reserved.</p>
                    <div className="flex flex-wrap items-center gap-6">
                        <Link href="/privacy-policy" className="transition hover:text-primary">Privacy Policy</Link>
                        <Link href="/terms" className="transition hover:text-primary">Terms &amp; Conditions</Link>
                        <span className="text-text-secondary/70">Designed with love by Tuhfina Creation</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </footer>
    );
}
