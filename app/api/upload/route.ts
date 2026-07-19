import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export async function POST(request: Request) {
    try {
        const auth = await requireAdmin();
        if (!auth.authorized) return auth.response;

        const formData = await request.formData();
        const files = formData.getAll('file') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        const uploadPromises = files.map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

            return await uploadImage(base64File);
        });

        const imageUrls = await Promise.all(uploadPromises);

        return NextResponse.json({ urls: imageUrls }, { status: 200 });
    } catch (error: any) {
        console.error('Upload API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
