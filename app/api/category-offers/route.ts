import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CategoryOffer from '@/models/CategoryOffer';

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
        await dbConnect();
        const body = await request.json();
        const { category, discountPercent, fixedPrice, startAt, endAt, label, isFlash } = body;

        const offer = await CategoryOffer.findOneAndUpdate(
            { category },
            {
                category,
                discountPercent,
                fixedPrice,
                startAt: new Date(startAt),
                endAt: new Date(endAt),
                label,
                isFlash,
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
