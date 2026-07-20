import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";

const client = new MongoClient(process.env.DATABASE_URL!);
const db = client.db();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "Tuhfinacreations@gmail.com")
    .split(",")[0]
    .trim()
    .toLowerCase();

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        minPasswordLength: 6,
        autoSignIn: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: 3600,
        async sendVerificationEmail({ user, url }) {
            await transporter.sendMail({
                from: `"Tuhfina Creations" <${process.env.SMTP_USER}>`,
                to: user.email,
                subject: "Verify your email - Tuhfina Creations",
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                        <h2 style="color: #2c3e50; text-align: center;">Verify Your Email</h2>
                        <p style="font-size: 16px; color: #555; text-align: center;">Click the button below to verify your email address and complete your registration.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${url}" style="background-color: #d4af37; color: white; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; display: inline-block;">
                                Verify Email Address
                            </a>
                        </div>
                        <p style="font-size: 14px; color: #888; text-align: center;">If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="font-size: 12px; color: #888; text-align: center; word-break: break-all;">${url}</p>
                        <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">This link expires in 1 hour.</p>
                    </div>
                `,
            });
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "USER",
                input: false,
            },
            isVerified: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: false,
            },
            phone: {
                type: "string",
                required: false,
                defaultValue: "",
                input: true,
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                async before(user) {
                    if (user.email?.toLowerCase() === ADMIN_EMAIL) {
                        user.role = "ADMIN";
                    }
                    user.isVerified = false;
                    return { data: user };
                },
            },
            update: {
                async after(data: any) {
                    if (data.user?.email?.toLowerCase() === ADMIN_EMAIL && data.user.role !== "ADMIN") {
                        data.user.role = "ADMIN";
                    }
                },
            },
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
    },
    advanced: {
        cookiePrefix: "tuhfina",
        trustHost: true,
    },
});

export async function getSession() {
    const { headers } = await import("next/headers");
    return auth.api.getSession({ headers: await headers() });
}
