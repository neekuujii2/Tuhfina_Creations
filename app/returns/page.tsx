import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Returns & Exchanges | Tuhfina Creation',
    description: 'Our hassle-free 7-day return and exchange policy for your luxury jewellery purchases.',
};

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-luxury-cream">
            <div className="section-shell section-padding">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-3">Policy</p>
                        <h1 className="text-4xl font-serif font-bold text-primary sm:text-5xl mb-4">Returns & Exchanges</h1>
                        <p className="text-text-secondary text-base">7-day hassle-free returns for your peace of mind.</p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-luxury-gold/10 space-y-8">
                        <Section title="Return Window" content="You may return any unused item within 7 days of delivery. The item must be in its original packaging with all tags and certificates intact." />
                        <Section title="Non-Returnable Items" content="Customized/personalized items cannot be returned unless there is a manufacturing defect or damage in transit. Items showing signs of wear or use are not eligible for return." />
                        <Section title="Exchange Policy" content="We offer free exchanges for size or design changes within 7 days, subject to availability. Customized items may not be eligible for exchange." />
                        <Section title="Refund Process" content="Once we receive and inspect your return, we will process your refund within 5-7 business days. Refunds are issued to the original payment method." />
                        <Section title="How to Initiate a Return" content="Contact our support team at Tuhfinacreations@gmail.com or call +91 98735 31273 to initiate a return. We will guide you through the process." />
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/contact" className="btn-gold px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider hover:scale-105 transition duration-300">
                            Initiate Return
                        </Link>
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
