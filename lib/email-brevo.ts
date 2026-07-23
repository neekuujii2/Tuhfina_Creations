import { BrevoClient } from '@getbrevo/brevo';

export interface SendViaBrevoOptions {
  to: string;
  subject: string;
  html: string;
}

const normalizeTo = (value: string) => value.trim().toLowerCase();

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

export async function sendViaBrevo({ to, subject, html }: SendViaBrevoOptions) {
  if (!apiKey) {
    throw new Error('[Email] BREVO_API_KEY is not configured');
  }

  if (!senderEmail) {
    throw new Error('[Email] BREVO_SENDER_EMAIL is not configured');
  }

  try {
    console.info(`[Email] Attempting Brevo with normalized sender email: ${normalizeTo(normalizedSenderEmail || '')}`);

    const response = await brevo.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent: html,
      sender: { name: 'Tuhfina Creations', email: normalizeTo(normalizedSenderEmail || '') },
      to: [{ email: normalizeTo(to) }],
    });

    console.info(`[Email] Brevo sent to ${to}, messageId: ${response.messageId}`);
    return response;
  } catch (error) {
    console.error('[Brevo] Failed:', error);
    throw error;
  }
}
