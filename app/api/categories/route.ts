import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { createCategorySchema } from '@/lib/validations';
import { sanitizeFields } from '@/lib/sanitize';
import { getCached, invalidateCache } from '@/lib/cache/redis';
import { logAudit } from '@/lib/auditLog';

const CACHE_KEY = 'categories:all';
const CATEGORIES_TTL = 300;

export async function GET() {
    try {
        await dbConnect();
        const categories = await getCached(
            CACHE_KEY,
            () => Category.find({}).sort({ order: 1, name: 1 }).lean(),
            CATEGORIES_TTL
        );
        return NextResponse.json(categories, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });
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
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        const body = await request.json();

        const parsed = createCategorySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = parsed.data;
        sanitizeFields(data, ['name', 'description']);

        await dbConnect();

        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

        const category = await Category.findOneAndUpdate(
            { name: data.name },
            {
                name: data.name,
                slug,
                image: data.image,
                description: data.description,
                department: data.department,
                parentCategory: data.parentCategory,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        await invalidateCache(CACHE_KEY);

        await logAudit({
          adminEmail: auth.user.email,
          action: 'category.create',
          entityType: 'Category',
          entityId: category._id.toString(),
          after: { name: category.name, description: category.description },
        });

        return NextResponse.json(category, { status: 200 });
    } catch (error: any) {
        console.error('POST CATEGORIES ERROR:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to save category' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const name = searchParams.get('name');

        await dbConnect();

        if (!id && !name) {
            return NextResponse.json({ error: 'Category id or name is required' }, { status: 400 });
        }

        const productCount = name
            ? await Category.findOne({ name }).lean()
            : await Category.findById(id).lean();

        if (!productCount) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        const deleted = id
            ? await Category.findByIdAndDelete(id)
            : await Category.findOneAndDelete({ name });

        if (!deleted) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        await invalidateCache(CACHE_KEY);

        await logAudit({
          adminEmail: auth.user.email,
          action: 'category.delete',
          entityType: 'Category',
          entityId: deleted._id.toString(),
          before: { name: deleted.name },
        });

        return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('DELETE CATEGORY ERROR:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete category' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        const body = await request.json();
        const { id, name, description, image, order: categoryOrder } = body;

        if (!id && !name) {
            return NextResponse.json({ error: 'Category id or name is required' }, { status: 400 });
        }

        await dbConnect();

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (image !== undefined) updateData.image = image;
        if (categoryOrder !== undefined) updateData.order = categoryOrder;
        if (name && !id) {
            updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        }

        const category = id
            ? await Category.findByIdAndUpdate(id, { $set: updateData }, { new: true })
            : await Category.findOneAndUpdate({ name }, { $set: updateData }, { new: true, upsert: true });

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        await invalidateCache(CACHE_KEY);

        await logAudit({
          adminEmail: auth.user.email,
          action: 'category.update',
          entityType: 'Category',
          entityId: category._id.toString(),
          before: { name: category.name, description: category.description },
          after: updateData,
        });

        return NextResponse.json(category, { status: 200 });
    } catch (error: any) {
        console.error('PUT CATEGORY ERROR:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update category' },
            { status: 500 }
        );
    }
}