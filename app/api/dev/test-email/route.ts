import { NextRequest, NextResponse } from 'next/server';
import { sendTransactionalEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const to = request.nextUrl.searchParams.get('to');

  if (!to) {
    return NextResponse.json({ error: 'Missing ?to=email query param' }, { status: 400 });
  }

  try {
    await sendTransactionalEmail({
      to,
      subject: 'Test Email from Tuhfina Creations',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
          <h2 style="color: #2c3e50; text-align: center;">Test Email</h2>
          <p style="font-size: 16px; color: #555; text-align: center;">This is a test email sent via Brevo from Tuhfina Creations.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: `Test email sent to ${to}` });
  } catch (error) {
    console.error('[Dev Test Email] Failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to send test email' }, { status: 500 });
  }
}
