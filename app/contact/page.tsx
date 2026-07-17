'use client';

export const dynamic = 'force-dynamic';

import { useState, FormEvent } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

const faqs = [
    { q: 'Do you offer international shipping?', a: 'Yes, we ship worldwide with tracked courier services.' },
    { q: 'Can I customise a design?', a: 'Absolutely. Every piece can be personalised with engraving, gemstones, or bespoke sizing.' },
    { q: 'What is your return policy?', a: 'We offer a 30-day return policy on unworn items in original packaging.' },
    { q: 'How long does delivery take?', a: 'India deliveries take 4-7 business days. International orders take 10-14 business days.' },
];

const storeHours = [
    { day: 'Monday - Friday', hours: '10:00 AM - 7:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 6:00 PM' },
    { day: 'Sunday', hours: '11:00 AM - 5:00 PM' },
];

function FadeInSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <div className="bg-background overflow-x-hidden">

            {/* ─── Hero ─── */}
            <section className="relative py-24 bg-luxury-warm/20 border-b border-border">
                <div className="section-shell px-4 sm:px-6 lg:px-10 xl:px-16 text-center">
                    <FadeInSection>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">Get in Touch</p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-primary mb-6">
                            Contact Us
                        </h1>
                        <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-secondary leading-relaxed">
                            We would love to hear from you. Reach out for bespoke orders, collaborations, or any enquiry.
                        </p>
                    </FadeInSection>
                </div>
            </section>

            {/* ─── Contact Grid ─── */}
            <section className="section-padding">
                <div className="section-shell">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Contact Form */}
                        <FadeInSection>
                            <div className="p-8 sm:p-10 rounded-[28px] border border-border bg-surface shadow-soft">
                                <h2 className="text-2xl font-serif font-bold text-primary mb-6">Send a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-primary mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-luxury-gold transition"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-primary mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-luxury-gold transition"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-primary mb-1.5">Phone</label>
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-luxury-gold transition"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-primary mb-1.5">Message</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-luxury-gold transition resize-none"
                                            placeholder="Tell us about your requirements..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full btn-luxury flex items-center justify-center gap-2"
                                    >
                                        <Send size={16} /> Send Message
                                    </button>
                                    {submitted && (
                                        <p className="text-sm text-green-600 text-center font-medium">Thank you! We will get back to you shortly.</p>
                                    )}
                                </form>
                            </div>
                        </FadeInSection>

                        {/* Info */}
                        <FadeInSection delay={0.15} className="space-y-8">
                            <div className="p-8 rounded-[28px] border border-border bg-surface">
                                <h3 className="text-xl font-serif font-bold text-primary mb-6">Contact Details</h3>
                                <div className="space-y-5">
                                    <div className="flex items-start gap-4">
                                        <Mail className="text-luxury-gold mt-0.5" size={20} />
                                        <div>
                                            <p className="text-sm font-semibold text-primary">Email</p>
                                            <a href="mailto:Tuhfinacreations@gmail.com" className="text-sm text-text-secondary hover:text-luxury-gold transition">Tuhfinacreations@gmail.com</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Phone className="text-luxury-gold mt-0.5" size={20} />
                                        <div>
                                            <p className="text-sm font-semibold text-primary">Phone</p>
                                            <a href="tel:+919873531273" className="text-sm text-text-secondary hover:text-luxury-gold transition">+91 98735 31273</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <MessageCircle className="text-luxury-gold mt-0.5" size={20} />
                                        <div>
                                            <p className="text-sm font-semibold text-primary">WhatsApp</p>
                                            <a href="https://wa.me/919873531273" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-luxury-gold transition">Chat with us</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <MapPin className="text-luxury-gold mt-0.5" size={20} />
                                        <div>
                                            <p className="text-sm font-semibold text-primary">Visit Us</p>
                                            <p className="text-sm text-text-secondary">Mumbai, India</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 rounded-[28px] border border-border bg-surface">
                                <h3 className="text-xl font-serif font-bold text-primary mb-6">Store Hours</h3>
                                <div className="space-y-3">
                                    {storeHours.map((item) => (
                                        <div key={item.day} className="flex items-center justify-between">
                                            <span className="text-sm text-text-secondary">{item.day}</span>
                                            <span className="text-sm font-semibold text-primary">{item.hours}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* ─── Map Placeholder ─── */}
            <section className="section-padding bg-luxury-warm/20 border-y border-border">
                <div className="section-shell">
                    <FadeInSection>
                        <div className="rounded-[28px] border border-border bg-surface overflow-hidden">
                            <div className="aspect-video w-full bg-gradient-to-br from-luxury-gold/5 to-accent/5 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="text-luxury-gold/40 mx-auto mb-3" size={40} />
                                    <p className="text-sm text-text-secondary font-medium">Google Map placeholder</p>
                                    <p className="text-xs text-text-secondary mt-1">Integrate Google Maps API here</p>
                                </div>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* ─── FAQ ─── */}
            <section className="section-padding">
                <div className="section-shell">
                    <FadeInSection className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2">FAQ</p>
                        <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">Frequently Asked Questions</h2>
                    </FadeInSection>

                    <div className="grid gap-6 md:grid-cols-2">
                        {faqs.map((faq, i) => (
                            <FadeInSection key={faq.q} delay={i * 0.08}>
                                <div className="p-6 rounded-[24px] border border-border bg-surface transition-all duration-500 hover:shadow-soft">
                                    <h3 className="text-base font-serif font-bold text-primary mb-2">{faq.q}</h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
