import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        await dbConnect();
        const user = await User.findById(session.userId).select('-password');

        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error('Error in /api/auth/me:', error);
        return NextResponse.json({ user: null }, { status: 200 });
    }
}
