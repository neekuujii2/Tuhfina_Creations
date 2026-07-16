import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';

const jewelleryCategories = [
    {
        name: 'Rings',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
        description: 'Exquisite diamond solitaire bands, classic gold rings, and contemporary statement bands.',
        department: 'Jewellery',
        parentCategory: 'Jewellery'
    },
    {
        name: 'Earrings',
        image: 'https://images.unsplash.com/photo-1635767790038-36447fee5209?q=80&w=600&auto=format&fit=crop',
        description: 'Elegant studs, drop earrings, chandeliers, and customized statement designs.',
        department: 'Jewellery',
        parentCategory: 'Jewellery'
    },
    {
        name: 'Necklaces',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
        description: 'Delicate gold chains, bespoke pendants, and statement choker necklaces.',
        department: 'Jewellery',
        parentCategory: 'Jewellery'
    },
    {
        name: 'Bracelets',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
        description: 'Fine charm bracelets, link chains, luxury cuffs, and adjustable bangles.',
        department: 'Jewellery',
        parentCategory: 'Jewellery'
    },
    {
        name: 'Mangalsutra',
        image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop',
        description: 'Modern minimalist sacred threads with diamond pendants and classic black beads.',
        department: 'Jewellery',
        parentCategory: 'Jewellery'
    },
    {
        name: 'Wedding Collection',
        image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=600&auto=format&fit=crop',
        description: 'Luxurious heavy sets, bridal necklaces, tikka pieces, and wedding rings.',
        department: 'Jewellery',
        parentCategory: 'Jewellery'
    }
];

const demoProducts = [
    // Rings
    {
        title: 'Aura Diamond Solitaire Ring',
        description: 'An elegant 18k yellow gold band featuring a brilliant-cut solitaire diamond in a classic claw setting.',
        price: 24500,
        category: 'Rings',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: true
    },
    {
        title: 'Classic Eternity Band',
        description: 'Stunning channel-set diamond eternity ring in premium 950 platinum. Crafted to sparkle from all angles.',
        price: 18900,
        category: 'Rings',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: false
    },
    {
        title: 'Rose Gold Floral Nest Ring',
        description: 'Intricately carved floral nesting band in 14k rose gold, embellished with tiny round diamonds.',
        price: 12500,
        category: 'Rings',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: true
    },
    {
        title: 'Empress Pearl Statement Ring',
        description: 'A glowing South Sea cultured pearl cradled in an open shank of polished 18k white gold.',
        price: 15400,
        category: 'Rings',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: false
    },

    // Earrings
    {
        title: 'Luminary Diamond Studs',
        description: 'Timeless round brilliant diamonds set in minimalist 18k white gold studs. Perfect for everyday luxury.',
        price: 9500,
        category: 'Earrings',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: false
    },
    {
        title: 'Celestial Rose Gold Drop Earrings',
        description: 'Delicate cascading stars in polished rose gold, featuring micro-pave diamond highlights.',
        price: 13200,
        category: 'Earrings',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: true
    },
    {
        title: 'Bespoke Monogram Studs',
        description: 'Personalised initials hand-engraved onto solid 14k gold square studs. Custom options available.',
        price: 7800,
        category: 'Earrings',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1635767790038-36447fee5209?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: true
    },
    {
        title: 'Gilded Hoop Earrings',
        description: 'Chunky yet lightweight textured gold hoops crafted in premium 22k gold plated brass.',
        price: 4500,
        category: 'Earrings',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: false
    },

    // Necklaces
    {
        title: 'Minimalist Diamond Solitaire Necklace',
        description: 'A single brilliant-cut diamond floating on a delicate 18k yellow gold cable chain.',
        price: 21000,
        category: 'Necklaces',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: true
    },
    {
        title: 'Engraved Initial Pendant Necklace',
        description: 'A classic circular disc pendant in 18k gold plated sterling silver, custom engraved with your choose of letters.',
        price: 6800,
        category: 'Necklaces',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: true
    },
    {
        title: 'Vintage Emerald Choker',
        description: 'An elegant vintage-inspired collar necklace embellished with pear-shaped green emeralds and crystals.',
        price: 24900,
        category: 'Necklaces',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: false
    },
    {
        title: 'Ethereal Pearl Strand Necklace',
        description: 'A hand-knotted strand of lustrous freshwater pearls finished with a luxury filigree gold clasp.',
        price: 16500,
        category: 'Necklaces',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: false
    },

    // Bracelets
    {
        title: 'Elysian Diamond Link Bracelet',
        description: 'Alternating gold and pave-diamond links forming a luxurious fluid chain with a secure box clasp.',
        price: 22800,
        category: 'Bracelets',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: false
    },
    {
        title: 'Rose Gold Custom Name Cuff',
        description: 'A sleek, open-ended 14k rose gold cuff bracelet customized with custom engraved interior lettering.',
        price: 11900,
        category: 'Bracelets',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: true
    },
    {
        title: 'Delicate Pearl Charm Bracelet',
        description: 'A fine yellow gold cable chain dotted with dainty white pearl charms and a star emblem.',
        price: 8500,
        category: 'Bracelets',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: true
    },
    {
        title: 'Gold Chevron Bangle',
        description: 'A modern stackable bangle featuring a geometric chevron pattern carved in solid 22k yellow gold.',
        price: 14500,
        category: 'Bracelets',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: false
    },

    // Mangalsutra
    {
        title: 'Sleek Minimalist Mangalsutra',
        description: 'Modern design with a petite diamond pendant suspended on a fine gold chain with traditional black beads.',
        price: 13900,
        category: 'Mangalsutra',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: true
    },
    {
        title: 'Classic Solitaire Sacred Thread',
        description: 'A beautiful single solitaire diamond focal point on a traditional hand-strung black bead chain.',
        price: 19800,
        category: 'Mangalsutra',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: false
    },

    // Wedding Collection
    {
        title: 'Royal Bridal Choker Set',
        description: 'Exquisite traditional kundan choker paired with matching drop earrings, designed for the luxury bride.',
        price: 45000,
        category: 'Wedding Collection',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: false
    },
    {
        title: 'Divine Temple Jhumkas',
        description: 'Heirloom temple earrings featuring intricate filigree gold bead detailing and dangling ruby drops.',
        price: 26000,
        category: 'Wedding Collection',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: false
    },
    {
        title: 'His and Hers Wedding Bands',
        description: 'Matching platinum bands with micro-pave diamond inserts, packaged in a custom velvet keepsake case.',
        price: 34000,
        category: 'Wedding Collection',
        department: 'Jewellery',
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'],
        isCustomizable: true
    }
];

export async function GET() {
    try {
        await dbConnect();

        // 1. Seed Categories
        const createdCategories = [];
        for (const cat of jewelleryCategories) {
            const existingCat = await Category.findOne({ name: cat.name });
            if (!existingCat) {
                const newCat = await Category.create(cat);
                createdCategories.push(newCat.name);
            } else {
                // Update properties in case they need to be refreshed
                existingCat.department = cat.department;
                existingCat.parentCategory = cat.parentCategory;
                existingCat.image = cat.image;
                existingCat.description = cat.description;
                await existingCat.save();
            }
        }

        // 2. Check if Jewellery products already exist to ensure idempotency
        const existingJewelleryProductsCount = await Product.countDocuments({ department: 'Jewellery' });
        
        let productsSeeded = 0;
        if (existingJewelleryProductsCount === 0) {
            // Seed all demo products
            for (const prod of demoProducts) {
                await Product.create(prod);
                productsSeeded++;
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Jewellery database seeded successfully!',
            categoriesChecked: jewelleryCategories.length,
            newCategoriesSeeded: createdCategories,
            existingJewelleryProducts: existingJewelleryProductsCount,
            newProductsSeeded: productsSeeded
        });

    } catch (error: any) {
        console.error('Seeding error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Seeding failed'
        }, { status: 500 });
    }
}
