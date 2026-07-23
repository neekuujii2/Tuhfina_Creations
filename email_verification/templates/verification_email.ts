export function getVerificationEmailHtml(verificationLink: string): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }
                .container { max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #eeeeee; text-align: center; }
                .header { color: #111111; margin-bottom: 20px; font-size: 24px; font-weight: bold; }
                .text { color: #555555; font-size: 16px; margin-bottom: 30px; line-height: 1.5; }
                .button { background-color: #b76e79; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; display: inline-block; }
                .footer { color: #888888; font-size: 12px; margin-top: 30px; word-break: break-all; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Verify Your Email Address</div>
                <div class="text">
                    Thank you for signing up with Tuhfina Creations! Please click the button below to verify your email address and activate your account.
                </div>
                <a href="${verificationLink}" class="button">Verify My Account</a>
                <div class="footer">
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p>${verificationLink}</p>
                    <p style="margin-top: 20px;">This link will expire in 24 hours.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
