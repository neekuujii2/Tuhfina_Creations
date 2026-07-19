import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import StoreSettings from '@/models/StoreSettings';
import { requireRole } from '@/lib/auth/requireRole';
import { getCached, invalidateCache } from '@/lib/cache/redis';

const CACHE_KEY = 'content:policies';
const POLICIES_TTL = 600;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        await dbConnect();

        const settings = await getCached(
            slug ? `${CACHE_KEY}:${slug}` : CACHE_KEY,
            () => StoreSettings.findOne({}).lean(),
            POLICIES_TTL
        );

        if (!settings) {
            return NextResponse.json({ error: 'No policies found' }, { status: 404 });
        }

        if (slug) {
            const policy = (settings as any)[`policy_${slug}`];
            return NextResponse.json({ slug, content: policy || '' }, { status: 200 });
        }

        return NextResponse.json({
            returnPolicy: (settings as any).policy_return || '',
            refundPolicy: (settings as any).policy_refund || '',
            privacyPolicy: (settings as any).policy_privacy || '',
            termsAndConditions: (settings as any).policy_terms || '',
            shippingPolicy: (settings as any).policy_shipping || '',
        }, { status: 200 });
    } catch (error: any) {
        console.error('GET POLICIES ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await requireRole(['owner', 'manager']);
        if (!auth.authorized) return auth.response;

        const body = await request.json();
        await dbConnect();

        const updateData: any = {};
        if (body.slug && body.content !== undefined) {
            updateData[`policy_${body.slug}`] = body.content;
        } else {
            if (body.returnPolicy !== undefined) updateData.policy_return = body.returnPolicy;
            if (body.refundPolicy !== undefined) updateData.policy_refund = body.refundPolicy;
            if (body.privacyPolicy !== undefined) updateData.policy_privacy = body.privacyPolicy;
            if (body.termsAndConditions !== undefined) updateData.policy_terms = body.termsAndConditions;
            if (body.shippingPolicy !== undefined) updateData.policy_shipping = body.shippingPolicy;
        }

        const settings = await StoreSettings.findOneAndUpdate(
            {},
            { $set: updateData },
            { new: true, upsert: true }
        );

        await invalidateCache([CACHE_KEY, `${CACHE_KEY}:return`, `${CACHE_KEY}:refund`, `${CACHE_KEY}:privacy`, `${CACHE_KEY}:terms`, `${CACHE_KEY}:shipping`]);

        return NextResponse.json(settings, { status: 200 });
    } catch (error: any) {
        console.error('POST POLICIES ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
