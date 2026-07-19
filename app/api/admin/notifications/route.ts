import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { requireAuth } from '@/lib/auth/requireAdmin';

export async function GET() {
    try {
        const auth = await requireAuth();
        if (!auth.authorized) return auth.response;

        await dbConnect();
        const notifications = await Notification.find({})
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({ isRead: false });

        return NextResponse.json({
            notifications,
            unreadCount
        });
    } catch (error: any) {
        console.error('Fetch notifications error:', error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}
