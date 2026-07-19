import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CategoryOffer from '@/models/CategoryOffer';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { categoryOfferSchema } from '@/lib/validations';
import { sanitizeFields } from '@/lib/sanitize';

export async function GET() {
    try {
        await dbConnect();
        const offers = await CategoryOffer.find({});
        return NextResponse.json(offers);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        const body = await request.json();

        const parsed = categoryOfferSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = parsed.data;
        sanitizeFields(data, ['label']);

        await dbConnect();

        const offer = await CategoryOffer.findOneAndUpdate(
            { category: data.category },
            {
                category: data.category,
                discountPercent: data.discountPercent,
                fixedPrice: data.fixedPrice,
                startAt: new Date(data.startAt),
                endAt: new Date(data.endAt),
                label: data.label,
                isFlash: data.isFlash,
            },
            { upsert: true, new: true }
        );

        return NextResponse.json(offer);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (id) {
            await CategoryOffer.findByIdAndDelete(id);
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
