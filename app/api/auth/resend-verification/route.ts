import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: true });
    }

    // Call Better Auth sendVerificationEmail API
    // This will send the verification email if the user is registered and unverified.
    await auth.api.sendVerificationEmail({
      body: {
        email,
        callbackURL: '/dashboard',
      },
    }).catch((err) => {
      // Better Auth throws a validation error if the email is already verified
      // or doesn't exist, which we swallow for security.
      console.warn('[ResendVerification] Handled error programmatically:', err.message || err);
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[ResendVerification] Unexpected error:', error);
    return NextResponse.json({ success: true });
  }
}
