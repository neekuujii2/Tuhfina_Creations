import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

/**
 * GET: Fetch all products sorted by createdAt desc
 */
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error('GET PRODUCTS ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * POST: Create a new product
 */
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    console.log('🟡 CREATE PRODUCT BODY:', body); // 🔥 DEBUG

    const {
      title,
      description,
      price,
      category,
      images,
      isCustomizable,
      festivalOffer,
    } = body;

    // 🔒 HARD VALIDATION (SAFE)
    if (
      !title ||
      !description ||
      price === undefined ||
      price === null ||
      !category ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return NextResponse.json(
        { error: 'Invalid product data (missing fields or images)' },
        { status: 400 }
      );
    }

    // 🔑 FORCE TYPES (VERY IMPORTANT)
    const normalizedImages = images.map((img: any) => String(img));
    const normalizedPrice = Number(price);

    if (Number.isNaN(normalizedPrice)) {
      return NextResponse.json(
        { error: 'Invalid price value' },
        { status: 400 }
      );
    }

    console.log('🟢 FINAL IMAGES ARRAY:', normalizedImages);

    const newProduct = await Product.create({
      title: String(title).trim(),
      description: String(description),
      price: normalizedPrice,
      category: String(category),
      images: normalizedImages,
      isCustomizable: Boolean(isCustomizable),
      festivalOffer: festivalOffer || undefined,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error('CREATE PRODUCT ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
