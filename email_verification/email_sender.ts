import nodemailer from 'nodemailer';
import { getVerificationEmailHtml } from './templates/verification_email';

export async function sendVerificationEmail(email: string, verificationLink: string): Promise<void> {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpFrom) {
        console.error('[EmailVerification] SMTP configuration is incomplete in environment variables.');
        throw new Error('Email service configuration error.');
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: smtpFrom,
            to: email,
            subject: 'Verify your email - Tuhfina Creations',
            html: getVerificationEmailHtml(verificationLink),
        });

        console.info(`[EmailVerification] Verification email successfully sent to ${email} (MessageId: ${info.messageId})`);
    } catch (error) {
        console.error('[EmailVerification] Error sending email via SMTP:', error);
        throw new Error('Failed to send verification email via SMTP.');
    }
}
