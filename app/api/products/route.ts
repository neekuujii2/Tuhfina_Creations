import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { createProductSchema, updateProductSchema } from '@/lib/validations';
import { sanitizeFields } from '@/lib/sanitize';
import { getCached, invalidateCache } from '@/lib/cache/redis';

const CACHE_KEYS = {
  all: 'products:all',
  category: (cat: string) => `products:category:${cat}`,
};

const PRODUCTS_TTL = 60;

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const query: any = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const [products, total] = await Promise.all([
      getCached(
        `${CACHE_KEYS.all}:${category || 'all'}:${search || 'none'}:${page}:${limit}`,
        () => Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        PRODUCTS_TTL
      ),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({ products, total, page, limit }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    console.error('GET PRODUCTS ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) return auth.response;

    const body = await request.json();

    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    sanitizeFields(data, ['title', 'description']);

    const normalizedImages = data.images.map((img) => String(img));
    const normalizedPrice = Number(data.price);

    if (Number.isNaN(normalizedPrice)) {
      return NextResponse.json(
        { error: 'Invalid price value' },
        { status: 400 }
      );
    }

    await dbConnect();

    const newProduct = await Product.create({
      title: data.title,
      description: data.description,
      price: normalizedPrice,
      category: data.category,
      department: data.department,
      images: normalizedImages,
      isCustomizable: Boolean(data.isCustomizable),
      festivalOffer: data.festivalOffer || undefined,
      stock: data.stock ?? 0,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
    });

    await invalidateCache([
      CACHE_KEYS.all,
      CACHE_KEYS.category(data.category),
    ]);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error('CREATE PRODUCT ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) return auth.response;

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');

    await dbConnect();

    if (ids) {
      const idArray = ids.split(',').filter((id) => mongoose.Types.ObjectId.isValid(id));
      if (idArray.length === 0) {
        return NextResponse.json({ error: 'No valid product IDs provided' }, { status: 400 });
      }

      const products = await Product.find({ _id: { $in: idArray } }).lean();
      const categories = [...new Set(products.map((p: any) => p.category))];

      await Product.deleteMany({ _id: { $in: idArray } });

      const invalidationKeys = [CACHE_KEYS.all, ...categories.map((cat) => CACHE_KEYS.category(cat))];
      await invalidateCache(invalidationKeys);

      return NextResponse.json({ message: 'Products deleted successfully', count: idArray.length }, { status: 200 });
    }

    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
    }

    const existing = await Product.findById(id).lean();
    const category = existing?.category;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const invalidationKeys = [CACHE_KEYS.all];
    if (category) invalidationKeys.push(CACHE_KEYS.category(category));
    await invalidateCache(invalidationKeys);

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('DELETE PRODUCT ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}