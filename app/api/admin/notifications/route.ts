import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function GET() {
    try {
        await dbConnect();
        const notifications = await Notification.find({})
            .sort({ createdAt: -1 })
            .limit(50); // Get latest 50

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
