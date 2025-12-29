# Why <img> is used instead of next/image

In this project, we have moved from `next/image` to standard `<img>` tags for product images for the following reasons:

1. **Remote Patterns Flexibility**: Since product images can come from various external sources (CSV imports, various external URLs, and Cloudinary), maintaining an exhaustive list of `remotePatterns` in `next.config.mjs` is brittle. Standard `<img>` tags work with any valid URL without configuration.
2. **Double Optimization Avoidance**: Cloudinary already provides powerful on-the-fly image optimization. Using `next/image` would trigger additional server-side optimization in Next.js, which is redundant and can lead to increased server load and costs.
3. **CSV Stability**: Images imported via CSV might point to legacy or external domains. A standard `<img>` tag with a fallback (`onError`) ensures that even if an image URL is broken or from an untrusted source, the application remains stable and doesn't crash during the build or runtime.
4. **Billing Constraints**: Next.js Image Optimization has usage limits on many deployment platforms (like Vercel). By using Cloudinary's direct URLs and standard `<img>` tags, we stay within the "Zero Billing" requirement by offloading optimization to Cloudinary's free tier.
5. **Zero Runtime Crashes**: `next/image` is strict about dimensions and hostnames. Standard `<img>` is more permissive, which is critical when dealing with bulk-imported data where image metadata might be inconsistent.
