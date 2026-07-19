import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AuditLog from '@/models/AuditLog';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export async function GET(request: Request) {
    try {
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        const { searchParams } = new URL(request.url);
        const adminEmail = searchParams.get('adminEmail');
        const action = searchParams.get('action');
        const entityType = searchParams.get('entityType');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        await dbConnect();

        const query: any = {};

        if (adminEmail) {
            query.adminEmail = { $regex: adminEmail, $options: 'i' };
        }
        if (action) {
            query.action = { $regex: action, $options: 'i' };
        }
        if (entityType) {
            query.entityType = entityType;
        }
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            AuditLog.countDocuments(query),
        ]);

        return NextResponse.json({ logs, total, page, limit }, { status: 200 });
    } catch (error: any) {
        console.error('GET AUDIT LOG ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        const body = await request.json();
        await dbConnect();

        const log = await AuditLog.create(body);

        return NextResponse.json(log, { status: 201 });
    } catch (error: any) {
        console.error('CREATE AUDIT LOG ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
