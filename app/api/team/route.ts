import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { requireRole, canManageUsers } from '@/lib/auth/requireRole';

export async function GET() {
    try {
        const auth = await requireRole(['owner']);
        if (!auth.authorized) return auth.response;

        await dbConnect();
        const users = await User.find({}).sort({ createdAt: -1 }).lean();

        return NextResponse.json(users, { status: 200 });
    } catch (error: any) {
        console.error('GET TEAM ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await requireRole(['owner']);
        if (!auth.authorized) return auth.response;

        const body = await request.json();
        const { email, name, role } = body;

        if (!email || !role) {
            return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
        }

        await dbConnect();

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const user = await User.create({
            email: email.toLowerCase(),
            name: name || email.split('@')[0],
            role,
            password: Math.random().toString(36).slice(-8),
            isVerified: true,
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error: any) {
        console.error('CREATE TEAM MEMBER ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const auth = await requireRole(['owner']);
        if (!auth.authorized) return auth.response;

        const body = await request.json();
        const { id, role, name } = body;

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await dbConnect();

        const updateData: any = {};
        if (role) updateData.role = role;
        if (name) updateData.name = name;

        const user = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        console.error('UPDATE TEAM MEMBER ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const auth = await requireRole(['owner']);
        if (!auth.authorized) return auth.response;

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Team member removed' }, { status: 200 });
    } catch (error: any) {
        console.error('DELETE TEAM MEMBER ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
