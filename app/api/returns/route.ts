import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ReturnRequest from '@/models/ReturnRequest';
import { requireRole } from '@/lib/auth/requireRole';

export async function GET() {
    try {
        const auth = await requireRole(['owner', 'manager', 'packer']);
        if (!auth.authorized) return auth.response;

        await dbConnect();
        const returns = await ReturnRequest.find({}).sort({ createdAt: -1 }).lean();

        return NextResponse.json(returns, { status: 200 });
    } catch (error: any) {
        console.error('GET RETURNS ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await requireRole(['owner', 'manager']);
        if (!auth.authorized) return auth.response;

        const body = await request.json();
        const { returnId, status, refundAmount, razorpayRefundId } = body;

        if (!returnId) {
            return NextResponse.json({ error: 'Return ID is required' }, { status: 400 });
        }

        await dbConnect();

        const updateData: any = {};
        if (status) updateData.status = status;
        if (refundAmount) updateData.refundAmount = refundAmount;
        if (razorpayRefundId) updateData.razorpayRefundId = razorpayRefundId;
        if (status === 'approved' || status === 'rejected' || status === 'refunded') {
            updateData.resolvedAt = new Date();
        }

        const returnRequest = await ReturnRequest.findByIdAndUpdate(returnId, { $set: updateData }, { new: true });

        if (!returnRequest) {
            return NextResponse.json({ error: 'Return request not found' }, { status: 404 });
        }

        return NextResponse.json(returnRequest, { status: 200 });
    } catch (error: any) {
        console.error('UPDATE RETURN ERROR:', error);
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
            return NextResponse.json({ error: 'Return ID is required' }, { status: 400 });
        }

        await dbConnect();

        const returnRequest = await ReturnRequest.findByIdAndDelete(id);

        if (!returnRequest) {
            return NextResponse.json({ error: 'Return request not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Return request deleted' }, { status: 200 });
    } catch (error: any) {
        console.error('DELETE RETURN ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
