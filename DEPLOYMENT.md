# Deployment Guide — Vercel + Cloudflare

## Overview

This project is deployed as a **Next.js 14 monolith on Vercel** with **Cloudflare** in front for DNS, CDN caching, and DDoS protection.

- **Hosting**: Vercel (no Docker, no standalone output)
- **Edge Layer**: Cloudflare free plan (DNS + CDN + Bot Fight Mode)
- **Database**: MongoDB Atlas
- **Storage**: Cloudinary
- **Email**: Brevo (primary) with Resend fallback
- **Cache**: Upstash Redis

---

## 1. Vercel Setup

### Import Project
1. Push the repository to GitHub.
2. In Vercel, import the project and select the GitHub repo.
3. Framework preset: **Next.js**.
4. Build Command: `next build` (default).
5. Output Directory: `.next` (default).

### Environment Variables

Add these in **Vercel Project Settings → Environment Variables** for both **Production** and **Preview**:

| Variable | Description |
|---|---|
| `DATABASE_URL` | MongoDB Atlas connection string |
| `BETTER_AUTH_SECRET` | Generate via `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | `https://your-custom-domain.com` (must match your Vercel domain) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Same as `BETTER_AUTH_URL` |
| `BREVO_API_KEY` | Brevo transactional email API key |
| `BREVO_SENDER_EMAIL` | Verified sender email in Brevo |
| `RESEND_API_KEY` | Resend API key (fallback email provider) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same Razorpay key ID (public) |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Admin email addresses (comma-separated) |
| `JWT_SECRET` | JWT signing secret |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token (optional) |
| `TELEGRAM_CHAT_ID` | Telegram chat ID (optional) |

> **Note**: `GOOGLE_APPLICATION_CREDENTIALS` is not needed on Vercel unless you use Firebase Admin SDK server-side.

### Custom Domain
1. In Vercel → Project Settings → Domains, add your custom domain.
2. Vercel will provide DNS target values.

---

## 2. Cloudflare Setup (Free Plan)

### DNS
1. Sign up at [cloudflare.com](https://cloudflare.com) and add your domain.
2. Replace your registrar's nameservers with Cloudflare's nameservers.
3. Add the following DNS records:

| Type | Name | Content / Target | Proxy |
|---|---|---|---|
| `CNAME` | `@` | `cname.vercel-dns.com` | Proxied (orange cloud) |
| `CNAME` | `www` | `cname.vercel-dns.com` | Proxied (orange cloud) |

> Use the exact CNAME target provided by Vercel for your custom domain.

### SSL/TLS
- Set **SSL/TLS** mode to **Full (strict)** so Cloudflare validates Vercel's certificate.
- Enable **Always Use HTTPS**.

### Caching
- Enable **Cache** for static assets (images, JS, CSS) at the edge.
- Set **Browser Cache TTL** to 4 hours for HTML, 7 days for static assets.
- This reduces origin load and improves latency for users far from Vercel's serving region.

### Security
- Enable **Bot Fight Mode** (free) for basic abuse protection.
- Enable **Under Attack Mode** only during active DDoS events.

### Notes
- Cloudflare sits in front of Vercel; it does **not** host the app.
- Vercel handles the build, serverless functions, and automatic HTTPS.
- All API routes remain on Vercel; Cloudflare caches only static assets.

---

## 3. Post-Deployment Verification

| Check | How to Verify |
|---|---|
| **Cold start < 1s** | Vercel serverless functions wake in milliseconds (no 50s sleep). |
| **Images via Vercel** | Open `/api/dev/test-image` or inspect `<img>` tags; `/_next/image` URLs confirm Vercel optimization. |
| **Auth / sessions** | Register / login / logout on the new domain; sessions persist. |
| **Rate limiting** | Trigger rate-limit endpoints; logs should show IP resolved from `x-vercel-forwarded-for` or `x-forwarded-for`. |
| **Email** | Hit `/api/dev/test-email?to=your@email.com` and confirm Brevo or Resend delivery. |
| **HTTPS** | Browser lock icon + Cloudflare "Full (strict)" certificate. |

---

## 4. Rollback

If issues arise:
1. In Vercel, go to **Deployments** and **Promote** the previous production deployment.
2. In Cloudflare, **Pause** the proxy (grey cloud) to bypass Cloudflare and hit Vercel directly while debugging.
