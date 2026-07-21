import { BrevoClient, BrevoError } from '@getbrevo/brevo';

const apiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_SENDER_EMAIL;

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
    const response = await brevo.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent: html,
      sender: { name: 'Tuhfina Creations', email: senderEmail },
      to: [{ email: to }],
    });

    console.info(`[Email] Sent to ${to}, messageId: ${response.messageId}`);
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    throw error;
  }
};
