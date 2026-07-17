'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState } from 'react';

const faqs = [
    {
        question: 'Do you ship internationally?',
        answer: 'Currently, we ship across India with free shipping on orders above ₹999. For international shipping inquiries, please contact us directly.',
    },
    {
        question: 'How long does delivery take?',
        answer: 'Standard delivery takes 5-7 business days. Express delivery is available in select cities within 2-3 business days.',
    },
    {
        question: 'Can I customize my jewellery?',
        answer: 'Yes! We offer text engraving and image upload customization for selected products. Visit our shop page and look for the "Customizable" badge.',
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards, UPI, net banking, and wallets through Razorpay secure payment gateway.',
    },
    {
        question: 'What is your return policy?',
        answer: 'We offer a 7-day hassle-free return policy for unused items in original packaging. Customized items cannot be returned unless defective.',
    },
    {
        question: 'Are your products certified?',
        answer: 'Yes, all our jewellery pieces are certified for quality and authenticity. We provide proper certification with every purchase.',
    },
    {
        question: 'Do you offer gift packaging?',
        answer: 'Absolutely! Every order comes with our signature luxury gift packaging. You can also add a personalized message during checkout.',
    },
    {
        question: 'How do I track my order?',
        answer: 'Once your order is shipped, you will receive a tracking link via email and SMS. You can also track it from your dashboard.',
    },
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-luxury-cream">
            <div className="section-shell section-padding">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-3">Support</p>
                        <h1 className="text-4xl font-serif font-bold text-primary sm:text-5xl mb-4">Frequently Asked Questions</h1>
                        <p className="text-text-secondary text-base">Everything you need to know about our products and services.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
                        ))}
                    </div>

                    <div className="mt-16 text-center bg-white rounded-2xl p-8 border border-luxury-gold/10">
                        <h3 className="text-2xl font-serif font-bold text-primary mb-2">Still have questions?</h3>
                        <p className="text-text-secondary mb-6">Can&apos;t find the answer you&apos;re looking for? Please reach out to our customer support.</p>
                        <Link href="/contact" className="btn-gold px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider hover:scale-105 transition duration-300">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="font-serif font-bold text-primary pr-4">{question}</span>
                <span className={`text-luxury-gold transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>+</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40' : 'max-h-0'}`}>
                <p className="px-6 pb-6 text-text-secondary text-sm leading-relaxed">{answer}</p>
            </div>
        </div>
    );
}
