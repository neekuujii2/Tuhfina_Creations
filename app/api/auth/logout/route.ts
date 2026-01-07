import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await deleteSession();
        return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
}
