import Link from 'next/link';
import { Sparkles, Heart, Gift, Star } from 'lucide-react';
import { CATEGORIES } from '@/lib/types';

export default function HomePage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="section-padding bg-luxury-cream">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center animate-fade-in">
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-luxury-black mb-6">
                            Handcrafted with
                            <span className="luxury-text-gradient"> Love</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-luxury-gray mb-8 max-w-3xl mx-auto leading-relaxed">
                            Discover exquisite handcrafted gifts, customized treasures, and beautiful floral arrangements that create lasting memories.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/shop" className="btn-luxury">
                                Explore Collection
                            </Link>
                            <Link href="/about" className="btn-outline-luxury">
                                Our Story
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section-padding">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center p-6 card-hover bg-white rounded-lg border border-gray-200">
                            <div className="inline-block p-4 bg-luxury-cream rounded-full mb-4">
                                <Sparkles className="text-luxury-gold" size={32} />
                            </div>
                            <h3 className="text-xl font-serif font-semibold mb-2">Handcrafted</h3>
                            <p className="text-luxury-gray text-sm">Each piece meticulously crafted with care</p>
                        </div>

                        <div className="text-center p-6 card-hover bg-white rounded-lg border border-gray-200">
                            <div className="inline-block p-4 bg-luxury-cream rounded-full mb-4">
                                <Heart className="text-luxury-gold" size={32} />
                            </div>
                            <h3 className="text-xl font-serif font-semibold mb-2">Customizable</h3>
                            <p className="text-luxury-gray text-sm">Personalize gifts to make them unique</p>
                        </div>

                        <div className="text-center p-6 card-hover bg-white rounded-lg border border-gray-200">
                            <div className="inline-block p-4 bg-luxury-cream rounded-full mb-4">
                                <Gift className="text-luxury-gold" size={32} />
                            </div>
                            <h3 className="text-xl font-serif font-semibold mb-2">Premium Quality</h3>
                            <p className="text-luxury-gray text-sm">Only the finest materials and craftsmanship</p>
                        </div>

                        <div className="text-center p-6 card-hover bg-white rounded-lg border border-gray-200">
                            <div className="inline-block p-4 bg-luxury-cream rounded-full mb-4">
                                <Star className="text-luxury-gold" size={32} />
                            </div>
                            <h3 className="text-xl font-serif font-semibold mb-2">Memorable</h3>
                            <p className="text-luxury-gray text-sm">Create moments that last forever</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section-padding bg-luxury-cream">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-black mb-4">
                            Our Collections
                        </h2>
                        <p className="text-lg text-luxury-gray max-w-2xl mx-auto">
                            Explore our curated categories of handcrafted gifts and personalized treasures
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {CATEGORIES.map((category, index) => (
                            <Link
                                key={index}
                                href={`/shop?category=${encodeURIComponent(category)}`}
                                className="group bg-white p-8 rounded-lg card-hover text-center border border-gray-200"
                            >
                                <div className="h-16 flex items-center justify-center mb-4">
                                    <div className="w-16 h-16 bg-luxury-cream rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <span className="text-2xl">
                                            {category.includes('Flower') ? '🌸' :
                                                category.includes('Earring') ? '💎' :
                                                    category.includes('Frame') ? '🖼️' :
                                                        category.includes('Keychain') ? '🔑' :
                                                            category.includes('Diwali') ? '🪔' : '🎁'}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="font-serif font-semibold text-lg text-luxury-black group-hover:text-luxury-gold transition-colors">
                                    {category}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding luxury-gradient text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                        Ready to Create Something Special?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Browse our collection and find the perfect gift for your loved ones
                    </p>
                    <Link
                        href="/shop"
                        className="inline-block bg-white text-luxury-gold px-10 py-4 rounded-md font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        Start Shopping
                    </Link>
                </div>
            </section>
        </div>
    );
}
