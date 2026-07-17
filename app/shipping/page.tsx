import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Shipping Policy | Tuhfina Creation',
    description: 'Learn about our shipping policies, delivery times, charges, and tracking information for your luxury jewellery orders.',
};

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-luxury-cream">
            <div className="section-shell section-padding">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-3">Info</p>
                        <h1 className="text-4xl font-serif font-bold text-primary sm:text-5xl mb-4">Shipping Policy</h1>
                        <p className="text-text-secondary text-base">Fast, secure, and reliable delivery across India.</p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-luxury-gold/10 space-y-8">
                        <Section title="Delivery Areas" content="We currently deliver across all major cities and towns in India. Remote areas may experience slightly longer delivery times." />
                        <Section title="Delivery Time" content="Standard delivery: 5-7 business days. Express delivery: 2-3 business days in select metro cities. Orders are processed within 24-48 hours." />
                        <Section title="Shipping Charges" content="Free shipping on all orders above ₹999. Orders below ₹999 incur a nominal shipping charge of ₹99." />
                        <Section title="Order Tracking" content="Once dispatched, you will receive a tracking link via SMS and email. Track your order in real-time until it reaches your doorstep." />
                        <Section title="Safe Packaging" content="Every order is carefully packaged in luxury gift-ready boxes with protective cushioning to ensure your jewellery arrives in perfect condition." />
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/contact" className="btn-gold px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider hover:scale-105 transition duration-300">
                            Contact Support
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
