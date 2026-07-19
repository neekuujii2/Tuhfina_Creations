import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { requireRole } from '@/lib/auth/requireRole';

export async function GET() {
    try {
        const auth = await requireRole(['owner', 'manager']);
        if (!auth.authorized) return auth.response;

        await dbConnect();
        const tickets = await SupportTicket.find({}).sort({ createdAt: -1 }).lean();

        return NextResponse.json(tickets, { status: 200 });
    } catch (error: any) {
        console.error('GET SUPPORT TICKETS ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await requireRole(['owner', 'manager', 'packer', 'viewer']);
        if (!auth.authorized) return auth.response;

        const body = await request.json();
        const { title, description, category, screenshotUrl } = body;

        if (!title || !description || !category) {
            return NextResponse.json({ error: 'Title, description, and category are required' }, { status: 400 });
        }

        await dbConnect();

        const ticket = await SupportTicket.create({
            title,
            description,
            category,
            screenshotUrl: screenshotUrl || '',
            raisedBy: auth.user.email,
        });

        return NextResponse.json(ticket, { status: 201 });
    } catch (error: any) {
        console.error('CREATE SUPPORT TICKET ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const auth = await requireRole(['owner', 'manager']);
        if (!auth.authorized) return auth.response;

        const body = await request.json();
        const { ticketId, status } = body;

        if (!ticketId) {
            return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
        }

        await dbConnect();

        const ticket = await SupportTicket.findByIdAndUpdate(
            ticketId,
            { $set: { status } },
            { new: true }
        );

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        return NextResponse.json(ticket, { status: 200 });
    } catch (error: any) {
        console.error('UPDATE SUPPORT TICKET ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
