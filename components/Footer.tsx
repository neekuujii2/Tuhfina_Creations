import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-luxury-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <Image src="/logo.jpg" alt="Tuhfina Creation Logo" width={50} height={50} className="rounded-full object-cover" />
                            <h3 className="text-2xl font-serif font-bold luxury-text-gradient">
                                Tuhfina Creation
                            </h3>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Crafting luxury and memories with handcrafted gifts, customized treasures, and exquisite floral arrangements.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-luxury-gold transition-colors text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop" className="text-gray-400 hover:text-luxury-gold transition-colors text-sm">
                                    Shop All
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-luxury-gold transition-colors text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-luxury-gold transition-colors text-sm">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Categories</h4>
                        <ul className="space-y-2">
                            <li className="text-gray-400 text-sm">Flower Bouquets</li>
                            <li className="text-gray-400 text-sm">Customized Earrings</li>
                            <li className="text-gray-400 text-sm">Personalized Frames</li>
                            <li className="text-gray-400 text-sm">Diwali Diyas & Candles</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-2 text-gray-400 text-sm">
                                <Mail size={16} className="mt-1 flex-shrink-0" />
                                <span>Tuhfinacreations@gmail.com</span>
                            </li>
                            <li className="flex items-start space-x-2 text-gray-400 text-sm">
                                <Phone size={16} className="mt-1 flex-shrink-0" />
                                <span>+91 9873531273</span>
                            </li>
                            <li className="flex items-start space-x-2 text-gray-400 text-sm">
                                <MapPin size={16} className="mt-1 flex-shrink-0" />
                                <span>India</span>
                            </li>
                        </ul>

                        {/* Social Media */}
                        <div className="flex space-x-4 mt-6">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-luxury-gold transition-colors"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-luxury-gold transition-colors"
                            >
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Tuhfina Creation. All rights reserved. Crafted with love.
                    </p>
                </div>
            </div>
        </footer>
    );
}
