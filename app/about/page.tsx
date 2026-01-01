import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { Product as ProductType } from '@/lib/types';

const testimonials = [
    {
        name: "Ananya Sharma",
        role: "Verified Buyer",
        content: "The customized frame I ordered for my parents' anniversary was absolutely stunning. The attention to detail and quality of craftsmanship is unmatched. Highly recommend!",
        rating: 5,
        date: "October 2024"
    },
    {
        name: "Rahul Mehra",
        role: "Gifting Enthusiast",
        content: "I've bought several artificial flower bouquets from Tuhfina Creation. They look so real and add a premium touch to my living room. Fast delivery too!",
        rating: 5,
        date: "November 2024"
    },
    {
        name: "Priya Patel",
        role: "Corporate Client",
        content: "Ordered 50+ customized keychains for our company event. Every single one was perfect. The quality of the materials used is very premium. Great experience.",
        rating: 5,
        date: "December 2024"
    }
];

export default async function AboutPage() {
    let categoryProducts: Record<string, ProductType[]> = {};

    try {
        await dbConnect();
        const products = await Product.find({}).sort({ createdAt: -1 }).lean();

        // Group products by category and take top 4 from each
        products.forEach((p: any) => {
            const product = { ...p, id: p._id.toString() } as ProductType;
            if (!categoryProducts[product.category]) {
                categoryProducts[product.category] = [];
            }
            if (categoryProducts[product.category].length < 4) {
                categoryProducts[product.category].push(product);
            }
        });
    } catch (error) {
        console.error('Error fetching products for About page:', error);
    }

    const categories = Object.keys(categoryProducts);

    return (
        <div className="bg-white">
            {/* Our Story Section */}
            <section className="section-padding bg-luxury-cream">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="animate-fade-in">
                            <h2 className="text-luxury-gold font-serif font-bold uppercase tracking-widest text-sm mb-4">Our Journey</h2>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-luxury-black mb-6">
                                Crafting Memories with <span className="luxury-text-gradient">Tuhfina Creation</span>
                            </h1>
                            <div className="space-y-4 text-luxury-gray text-lg leading-relaxed">
                                <p>
                                    At Tuhfina Creation, we believe that gifts are more than just objects; they are expressions of love, gratitude, and cherished memories. Our journey began with a simple passion for creating beautiful, handcrafted pieces that bring joy to people&apos;s lives.
                                </p>
                                <p>
                                    Every product in our collection is meticulously crafted by skilled artisans who pour their heart and soul into every detail. From vibrant artificial flowers to personalized treasures, we ensure that each item meets our high standards of quality and elegance.
                                </p>
                                <p>
                                    Based on trust and a commitment to excellence, we&apos;ve grown into a brand that stands for luxury gifting. We take pride in helping you celebrate life&apos;s most precious moments with gifts that are as unique as the people receiving them.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-8 mt-10">
                                <div>
                                    <h4 className="text-2xl font-serif font-bold text-luxury-black mb-1">100%</h4>
                                    <p className="text-sm text-luxury-gray">Handmade with Love</p>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-serif font-bold text-luxury-black mb-1">5000+</h4>
                                    <p className="text-sm text-luxury-gray">Happy Customers</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
                            <video
                                src="/videos/crafting-process.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section-padding">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="p-8 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="inline-block p-4 bg-luxury-cream rounded-full mb-6">
                                <Sparkles className="text-luxury-gold" size={32} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-luxury-black mb-4">Premium Quality</h3>
                            <p className="text-luxury-gray">We use only the finest materials to ensure your gifts remain beautiful for years to come.</p>
                        </div>
                        <div className="p-8 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="inline-block p-4 bg-luxury-cream rounded-full mb-6">
                                <Heart className="text-luxury-gold" size={32} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-luxury-black mb-4">Personalized Touch</h3>
                            <p className="text-luxury-gray">Customize your gifts to make them truly unique and special for your loved ones.</p>
                        </div>
                        <div className="p-8 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="inline-block p-4 bg-luxury-cream rounded-full mb-6">
                                <ShieldCheck className="text-luxury-gold" size={32} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-luxury-black mb-4">Trusted Brand</h3>
                            <p className="text-luxury-gray">Join thousands of customers who trust us for their most important gifting needs.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category-wise Top Products */}
            <section className="section-padding bg-luxury-cream">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-black mb-4">Our Masterpieces</h2>
                        <p className="text-lg text-luxury-gray max-w-2xl mx-auto">Explore the finest selections from our diverse collections</p>
                    </div>

                    {categories.length > 0 ? (
                        <div className="space-y-20">
                            {categories.map((category) => (
                                <div key={category}>
                                    <div className="flex justify-between items-end mb-8 border-b border-luxury-gold/20 pb-4">
                                        <h3 className="text-3xl font-serif font-bold text-luxury-black">{category}</h3>
                                        <Link href={`/shop?category=${encodeURIComponent(category)}`} className="text-luxury-gold font-semibold hover:underline">
                                            View All
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {categoryProducts[category].map((product) => (
                                            <Link key={product.id} href={`/product/${product.id}`} className="group">
                                                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                                                    <div className="relative h-72 w-full overflow-hidden">
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <div className="p-6">
                                                        <h4 className="font-serif font-bold text-lg text-luxury-black mb-2 line-clamp-1">{product.title}</h4>
                                                        <p className="text-luxury-gold font-bold">₹{product.price.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-luxury-gray italic">New masterpieces coming soon...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="section-padding">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-black mb-4">What Our Clients Say</h2>
                        <p className="text-lg text-luxury-gray">Experiences from our wonderful community of gift-givers</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-luxury-cream p-8 rounded-2xl relative">
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="text-luxury-gold fill-luxury-gold" size={18} />
                                    ))}
                                </div>
                                <p className="text-luxury-black italic mb-6 leading-relaxed">&quot;{testimonial.content}&quot;</p>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-bold text-xl">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h5 className="font-serif font-bold text-luxury-black">{testimonial.name}</h5>
                                        <p className="text-xs text-luxury-gray">{testimonial.role} • {testimonial.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="section-padding luxury-gradient text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Become Part of Our Story</h2>
                    <p className="text-xl mb-10 opacity-90">Experience the magic of handcrafted luxury gifting today.</p>
                    <Link href="/shop" className="bg-white text-luxury-gold px-12 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        Start Your Collection
                    </Link>
                </div>
            </section>
        </div>
    );
}
