import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { sendTransactionalEmail } from "@/lib/email";

let mongoClient: MongoClient | null = null;
let mongoDb: ReturnType<MongoClient['db']> | null = null;

const getMongoClient = () => {
    if (!process.env.DATABASE_URL) {
        throw new Error("[Auth] DATABASE_URL is not configured");
    }

    if (!mongoClient) {
        mongoClient = new MongoClient(process.env.DATABASE_URL);
    }

    return mongoClient;
};

const getMongoDb = () => {
    if (!mongoDb) {
        mongoDb = getMongoClient().db();
    }

    return mongoDb;
};

const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "Tuhfinacreations@gmail.com")
    .split(",")[0]
    .trim()
    .toLowerCase();

const missingEnv = (key: string) => !process.env[key];
if (missingEnv("BREVO_API_KEY")) console.warn("[Auth] BREVO_API_KEY is missing");
if (missingEnv("BREVO_SENDER_EMAIL")) console.warn("[Auth] BREVO_SENDER_EMAIL is missing");
if (missingEnv("BETTER_AUTH_URL")) console.warn("[Auth] BETTER_AUTH_URL is missing");
if (missingEnv("BETTER_AUTH_SECRET")) console.warn("[Auth] BETTER_AUTH_SECRET is missing");
if (missingEnv("DATABASE_URL")) console.warn("[Auth] DATABASE_URL is missing");

const databaseConfig = process.env.DATABASE_URL
    ? mongodbAdapter(getMongoDb(), { client: getMongoClient() })
    : undefined;

export const auth = betterAuth({
    ...(databaseConfig ? { database: databaseConfig } : {}),
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        minPasswordLength: 6,
        autoSignIn: true,
        resetPasswordTokenExpiresIn: 3600,
        async sendResetPassword({ user, url }) {
            await sendTransactionalEmail({
                to: user.email,
                subject: "Reset your password - Tuhfina Creations",
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                        <h2 style="color: #2c3e50; text-align: center;">Reset Your Password</h2>
                        <p style="font-size: 16px; color: #555; text-align: center;">We received a request to reset your password. Click the button below to choose a new password.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${url}" style="background-color: #d4af37; color: white; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; display: inline-block;">
                                Reset Password
                            </a>
                        </div>
                        <p style="font-size: 14px; color: #888; text-align: center;">If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="font-size: 12px; color: #888; text-align: center; word-break: break-all;">${url}</p>
                        <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
                    </div>
                `,
            });
        },
    },
    emailVerification: {
        sendOnSignUp: false, // Disabled default to use our custom verification service
        autoSignInAfterVerification: true,
        expiresIn: 3600,
        async sendVerificationEmail({ user, url }) {
            // Keep this as fallback or if better-auth manually triggers it, but typically it won't be called now
            await sendTransactionalEmail({
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
                async after(user) {
                    // Trigger our custom email verification via Resend
                    // We dynamically import to avoid circular dependencies or top-level await issues
                    if (user && user.email) {
                        import('@/email_verification/verification_service')
                            .then(({ initiateVerification }) => initiateVerification(user.email))
                            .catch(err => console.error('[Auth] Failed to trigger custom verification:', err));
                    }
                }
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
        trustedOrigins: [
            process.env.BETTER_AUTH_URL,
            "https://tuhfina-creations-xi.vercel.app",
            ...(process.env.NODE_ENV !== "production" ? ["http://localhost:3000"] : [])
        ].filter(Boolean),
        ipAddress: {
            ipAddressHeaders: ["x-forwarded-for", "x-vercel-forwarded-for"],
        },
    },
});

export async function getSession() {
    const { headers } = await import("next/headers");
    return auth.api.getSession({ headers: await headers() });
}
