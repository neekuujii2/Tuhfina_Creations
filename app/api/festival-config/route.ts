import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import FestivalConfig from '@/models/FestivalConfig';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { festivalConfigSchema } from '@/lib/validations';
import { sanitizeFields } from '@/lib/sanitize';
import { getCached, invalidateCache } from '@/lib/cache/redis';

const CACHE_KEY = 'festival:config';
const FESTIVAL_TTL = 120;

export async function GET() {
    try {
        await dbConnect();
        const config = await getCached(
            CACHE_KEY,
            async () => {
                let c = await FestivalConfig.findOne({});
                if (!c) {
                    return {
                        active: false,
                        bannerText: 'Festival Sale is LIVE!',
                        startAt: new Date().toISOString(),
                        endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    };
                }
                return c;
            },
            FESTIVAL_TTL
        );
        return NextResponse.json(config, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        const body = await request.json();

        const parsed = festivalConfigSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = parsed.data;
        sanitizeFields(data, ['bannerText', 'bannerSubtext']);

        await dbConnect();

        const config = await FestivalConfig.findOneAndUpdate(
            {},
            {
                ...data,
                startAt: data.startAt ? new Date(data.startAt) : undefined,
                endAt: data.endAt ? new Date(data.endAt) : undefined,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        await invalidateCache(CACHE_KEY);

        return NextResponse.json(config);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
