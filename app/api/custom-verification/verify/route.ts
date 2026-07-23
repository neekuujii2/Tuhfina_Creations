import { NextResponse } from 'next/server';
import { verifyTokenAndActivateAccount } from '@/email_verification/verification_service';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.redirect(new URL('/login?error=MissingToken', request.url));
    }

    try {
        const isValid = await verifyTokenAndActivateAccount(token);

        if (isValid) {
            // Successfully verified! Redirect to success page
            return NextResponse.redirect(new URL('/verify-email-success', request.url));
        } else {
            // Token invalid or expired
            return NextResponse.redirect(new URL('/login?error=InvalidToken', request.url));
        }
    } catch (error) {
        console.error('[VerifyAPI] Error during token verification:', error);
        return NextResponse.redirect(new URL('/login?error=VerificationFailed', request.url));
    }
}
