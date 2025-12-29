import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
    try {
        await dbConnect();
        const categories = await Category.find({}).sort({ name: 1 });
        return NextResponse.json(categories, { status: 200 });
    } catch (error: any) {
        console.error('GET CATEGORIES ERROR:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { name, image, description } = body;

        if (!name) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }

        const category = await Category.findOneAndUpdate(
            { name },
            { name, image, description },
            { upsert: true, new: true }
        );

        return NextResponse.json(category, { status: 200 });
    } catch (error: any) {
        console.error('POST CATEGORIES ERROR:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to save category' },
            { status: 500 }
        );
    }
}
