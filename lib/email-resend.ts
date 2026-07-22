import { Resend } from 'resend';

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
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('[Email-Resend] RESEND_API_KEY is not configured');
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: 'Tuhfina Creations <onboarding@resend.dev>',
    to: [to],
    subject,
    html,
  });

  if (error) {
    console.error('[Email-Resend] Failed to send:', error);
    throw new Error(`[Email-Resend] ${error.message}`);
  }

  console.info(`[Email-Resend] Sent to ${to}, messageId: ${data?.id}`);
};
