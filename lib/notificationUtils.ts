import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmailNotification = async (order: any) => {
    const mailOptions = {
        from: `"Tuhfina Creations Alert" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: '🛒 New Paid Order Received',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #2c3e50;">🛒 New Paid Order Received</h2>
                <p>A new order has been successfully paid on your store.</p>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Amount:</strong> ₹${order.totalAmount}</p>
                <p><strong>Customer:</strong> ${order.userEmail}</p>
                <p><strong>Payment ID:</strong> ${order.razorpayPaymentId}</p>
                <div style="margin-top: 20px;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin" 
                       style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        View in Dashboard
                    </a>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email notification sent for order ${order._id}`);
    } catch (error) {
        console.error('Error sending email notification:', error);
    }
};

export const sendOtpEmail = async (email: string, otp: string) => {
    const mailOptions = {
        from: `"Tuhfina Creations" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Your Tuhfina Creations Login Code',
        text: `Your verification code is: ${otp}\nThis code expires in 5 minutes.\nDo not share this code.`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                <h2 style="color: #2c3e50; text-align: center;">Verification Code</h2>
                <p style="font-size: 16px; color: #555; text-align: center;">Use the code below to sign in to your Tuhfina Creations account.</p>
                <div style="background-color: #f7f9fc; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2c3e50;">${otp}</span>
                </div>
                <p style="font-size: 14px; color: #888; text-align: center;">This code expires in 5 minutes.</p>
                <p style="font-size: 14px; color: #888; text-align: center;">Do not share this code with anyone.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};

export const sendTelegramNotification = async (order: any) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error('Telegram config missing: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
        return;
    }

    const message = `🛒 *NEW ORDER PAID*\n\n*Order ID:* \`${order._id}\`\n*Amount:* ₹${order.totalAmount}\n*Customer:* ${order.userEmail}\n*Payment ID:* \`${order.razorpayPaymentId}\``;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Telegram API error:', errorData);
        } else {
            console.log(`Telegram notification sent for order ${order._id}`);
        }
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
    }
};
