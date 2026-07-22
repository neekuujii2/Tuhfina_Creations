import { BrevoClient, BrevoError } from '@getbrevo/brevo';
import { sendTransactionalEmail as sendTransactionalEmailResend } from './email-resend';

const apiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_SENDER_EMAIL;

const normalizedSenderEmail = senderEmail?.trim().toLowerCase();

if (!apiKey) {
  console.warn('[Email] BREVO_API_KEY is missing from environment variables');
}

if (!senderEmail) {
  console.warn('[Email] BREVO_SENDER_EMAIL is missing from environment variables');
}

const brevo = new BrevoClient({ apiKey: apiKey || '' });

export interface SendTransactionalEmailOptions {
  to: string;
  subject: string;
  html: string;
}

const normalizeTo = (value: string) => value.trim().toLowerCase();

const sendWithBrevo = async (payload: SendTransactionalEmailOptions) => {
  console.info(`[Email] Attempting Brevo with normalized sender email: ${normalizeTo(normalizedSenderEmail || '')}`);

  const response = await brevo.transactionalEmails.sendTransacEmail({
    subject: payload.subject,
    htmlContent: payload.html,
    sender: { name: 'Tuhfina Creations', email: normalizeTo(normalizedSenderEmail || '') },
    to: [{ email: normalizeTo(payload.to) }],
  });

  console.info(`[Email] Brevo sent to ${payload.to}, messageId: ${response.messageId}`);
};

export const sendTransactionalEmail = async ({
  to,
  subject,
  html,
}: SendTransactionalEmailOptions): Promise<void> => {
  if (!apiKey) {
    throw new Error('[Email] BREVO_API_KEY is not configured');
  }

  if (!senderEmail) {
    throw new Error('[Email] BREVO_SENDER_EMAIL is not configured');
  }

  try {
    await sendWithBrevo({ to, subject, html });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[Email] Brevo failed, falling back to Resend:', message);
    try {
      await sendTransactionalEmailResend({ to, subject, html });
      console.info('[Email] Resend fallback succeeded');
    } catch (resendError) {
      const resendMessage = resendError instanceof Error ? resendError.message : String(resendError);
      console.error('[Email] Resend fallback also failed:', resendMessage);
      throw new Error(`[Email] Both Brevo and Resend failed. Brevo: ${message}. Resend: ${resendMessage}`);
    }
  }
};
