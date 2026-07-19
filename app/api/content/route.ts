import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import StoreSettings from '@/models/StoreSettings';
import { requireRole, canManageSettings } from '@/lib/auth/requireRole';
import { getCached, invalidateCache } from '@/lib/cache/redis';

const CACHE_KEY = 'content:home';
const CONTENT_TTL = 300;

export async function GET() {
    try {
        await dbConnect();
        const content = await getCached(
            CACHE_KEY,
            async () => {
                const settings = await StoreSettings.findOne({}).lean();
                return {
                    heroImage: (settings as any)?.heroImage || '',
                    heroHeading: (settings as any)?.heroHeading || 'Welcome to Tuhfina Creations',
                    heroSubheading: (settings as any)?.heroSubheading || 'Handcrafted with love',
                    heroCtaText: (settings as any)?.heroCtaText || 'Shop Now',
                    heroCtaLink: (settings as any)?.heroCtaLink || '/products',
                    announcementText: (settings as any)?.announcementText || '',
                    announcementEnabled: (settings as any)?.announcementEnabled || false,
                };
            },
            CONTENT_TTL
        );
        return NextResponse.json(content, { status: 200 });
    } catch (error: any) {
        console.error('GET CONTENT ERROR:', error);
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
            {
                $set: {
                    heroImage: body.heroImage,
                    heroHeading: body.heroHeading,
                    heroSubheading: body.heroSubheading,
                    heroCtaText: body.heroCtaText,
                    heroCtaLink: body.heroCtaLink,
                    announcementText: body.announcementText,
                    announcementEnabled: body.announcementEnabled,
                },
            },
            { new: true, upsert: true }
        );

        await invalidateCache(CACHE_KEY);

        return NextResponse.json(settings, { status: 200 });
    } catch (error: any) {
        console.error('POST CONTENT ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
