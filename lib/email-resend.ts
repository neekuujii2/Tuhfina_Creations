import { Resend } from 'resend';

export interface SendViaResendOptions {
  to: string;
  subject: string;
  html: string;
}

const normalizeTo = (value: string) => value.trim().toLowerCase();

export async function sendViaResend({
  to,
  subject,
  html,
}: SendViaResendOptions) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('[Email] RESEND_API_KEY is not configured');
  }

  const senderEmail = process.env.RESEND_SENDER_EMAIL?.trim().toLowerCase() || 'onboarding@resend.dev';

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: `Tuhfina Creations <${senderEmail}>`,
      to: [normalizeTo(to)],
      subject,
      html,
    });

    if (result.error) {
      console.error('[Resend] Failed:', result.error);
      throw new Error(`[Resend] ${result.error.message}`);
    }

    console.info(`[Resend] Sent to ${to}, id: ${result.data?.id}`);
    return result;
  } catch (error) {
    console.error('[Resend] Failed:', error);
    throw error;
  }
}
