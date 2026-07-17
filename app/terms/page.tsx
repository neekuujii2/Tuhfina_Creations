import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Terms & Conditions | Tuhfina Creation',
    description: 'Read the terms and conditions for using Tuhfina Creation luxury jewellery and gifting services.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-luxury-cream">
            <div className="section-shell section-padding">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-3">Legal</p>
                        <h1 className="text-4xl font-serif font-bold text-primary sm:text-5xl mb-4">Terms & Conditions</h1>
                        <p className="text-text-secondary text-base">Last updated: July 2026</p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-luxury-gold/10 space-y-8">
                        <Section title="Acceptance of Terms" content="By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services." />
                        <Section title="Products and Pricing" content="All products are subject to availability. We reserve the right to modify prices and product descriptions without prior notice. Prices are listed in Indian Rupees (INR)." />
                        <Section title="Orders and Payments" content="All orders are subject to acceptance and availability. We reserve the right to cancel any order for reasons including but not limited to product availability, pricing errors, or suspected fraud." />
                        <Section title="Intellectual Property" content="All content on this website, including images, text, logos, and designs, is the property of Tuhfina Creation and is protected by copyright laws." />
                        <Section title="Limitation of Liability" content="Tuhfina Creation shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our products or services." />
                        <Section title="Governing Law" content="These terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India." />
                        <Section title="Contact" content="For questions about these terms, please contact us at Tuhfinacreations@gmail.com or call +91 98735 31273." />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, content }: { title: string; content: string }) {
    return (
        <div>
            <h3 className="font-serif font-bold text-primary text-lg mb-2">{title}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{content}</p>
        </div>
    );
}
