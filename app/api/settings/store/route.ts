import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import StoreSettings from '@/models/StoreSettings';
import { requireRole, canManageSettings } from '@/lib/auth/requireRole';
import { getCached, invalidateCache } from '@/lib/cache/redis';

const CACHE_KEY = 'store:settings';
const SETTINGS_TTL = 300;

export async function GET() {
    try {
        await dbConnect();
        const settings = await getCached(
            CACHE_KEY,
            () => StoreSettings.findOne({}).lean(),
            SETTINGS_TTL
        );
        return NextResponse.json(settings || {}, { status: 200 });
    } catch (error: any) {
        console.error('GET STORE SETTINGS ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await requireRole(['owner', 'manager']);
        if (!auth.authorized) return auth.response;

        const body = await request.json();
        await dbConnect();

        const settings = await StoreSettings.findOneAndUpdate(
            {},
            { $set: body },
            { new: true, upsert: true }
        );

        await invalidateCache(CACHE_KEY);

        return NextResponse.json(settings, { status: 200 });
    } catch (error: any) {
        console.error('POST STORE SETTINGS ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
