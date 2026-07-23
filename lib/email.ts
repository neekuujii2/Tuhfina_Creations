import { sendViaResend } from './email-resend';
import { sendViaBrevo } from './email-brevo';

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
  try {
    await sendViaResend({ to, subject, html });
  } catch (resendError) {
    const resendMessage = resendError instanceof Error ? resendError.message : String(resendError);
    console.error('[Email] Resend failed, falling back to Brevo:', resendError);

    try {
      await sendViaBrevo({ to, subject, html });
    } catch (brevoError) {
      const brevoMessage = brevoError instanceof Error ? brevoError.message : String(brevoError);
      console.error('[Email] Brevo fallback also failed:', brevoError);
      throw new Error(`[Email] Both Resend and Brevo failed. Resend: ${resendMessage}. Brevo: ${brevoMessage}`);
    }
  }
};
