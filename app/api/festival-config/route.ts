import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import FestivalConfig from '@/models/FestivalConfig';

export async function GET() {
    try {
        await dbConnect();
        // Get the only config or return defaults
        let config = await FestivalConfig.findOne({});
        if (!config) {
            // Return a default object if none exists yet
            return NextResponse.json({
                active: false,
                bannerText: 'Festival Sale is LIVE! ✨',
                startAt: new Date(),
                endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
            });
        }
        return NextResponse.json(config);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Upsert the single config document
        const config = await FestivalConfig.findOneAndUpdate(
            {},
            {
                ...body,
                startAt: body.startAt ? new Date(body.startAt) : undefined,
                endAt: body.endAt ? new Date(body.endAt) : undefined,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json(config);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
