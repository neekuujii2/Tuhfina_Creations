import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy | Tuhfina Creation',
    description: 'Read the privacy policy for Tuhfina Creation luxury jewellery and gifting brand.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-luxury-cream">
            <div className="section-shell section-padding">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-3">Legal</p>
                        <h1 className="text-4xl font-serif font-bold text-primary sm:text-5xl mb-4">Privacy Policy</h1>
                        <p className="text-text-secondary text-base">Last updated: July 2026</p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-luxury-gold/10 space-y-8">
                        <Section title="Information We Collect" content="We collect personal information such as your name, email address, phone number, and shipping address when you place an order or create an account. We also collect non-personal information like browser type and IP address for analytics." />
                        <Section title="How We Use Your Information" content="We use your information to process orders, provide customer support, send order updates, and improve our services. We do not sell or rent your personal information to third parties." />
                        <Section title="Data Security" content="We implement industry-standard security measures to protect your personal information. All payment transactions are processed securely through Razorpay." />
                        <Section title="Cookies" content="We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can disable cookies in your browser settings." />
                        <Section title="Third-Party Services" content="We use trusted third-party services including Razorpay for payments, Cloudinary for image hosting, and Firebase for analytics. These services have their own privacy policies." />
                        <Section title="Contact Us" content="If you have any questions about this Privacy Policy, please contact us at Tuhfinacreations@gmail.com or call +91 98735 31273." />
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
