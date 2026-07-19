import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { requireAdmin, requireAuth } from '@/lib/auth/requireAdmin';
import { updateSettingsSchema } from '@/lib/validations';
import { getCached, invalidateCache } from '@/lib/cache/redis';

const CACHE_KEY = 'settings:global';
const SETTINGS_TTL = 300;

export async function GET() {
    try {
        const auth = await requireAuth();
        if (!auth.authorized) return auth.response;

        await dbConnect();
        const settingsMap = await getCached(
            CACHE_KEY,
            async () => {
                const settings = await Settings.find({}).lean();
                return settings.reduce((acc: any, curr: any) => {
                    acc[curr.key] = curr.value;
                    return acc;
                }, {});
            },
            SETTINGS_TTL
        );
        return NextResponse.json(settingsMap, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        const body = await request.json();

        const parsed = updateSettingsSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { key, value } = parsed.data;

        await dbConnect();

        const setting = await Settings.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );

        await invalidateCache(CACHE_KEY);

        return NextResponse.json(setting);
    } catch (error) {
        console.error('Error updating setting:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
