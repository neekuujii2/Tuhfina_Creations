import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { updateProductSchema } from '@/lib/validations';
import { sanitizeFields } from '@/lib/sanitize';
import { invalidateCache } from '@/lib/cache/redis';

const CACHE_KEYS = {
  all: 'products:all',
  category: (cat: string) => `products:category:${cat}`,
};

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
        }

        await dbConnect();
        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        const { id } = params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
        }

        const body = await request.json();

        const parsed = updateProductSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = parsed.data;
        sanitizeFields(data, ['title', 'description']);

        await dbConnect();

        const existing = await Product.findById(id).lean();
        const oldCategory = existing?.category;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const invalidationKeys = [CACHE_KEYS.all];
        if (oldCategory) invalidationKeys.push(CACHE_KEYS.category(oldCategory));
        if (data.category && data.category !== oldCategory) {
            invalidationKeys.push(CACHE_KEYS.category(data.category));
        }
        await invalidateCache(invalidationKeys);

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        const { id } = params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
        }

        await dbConnect();

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
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}