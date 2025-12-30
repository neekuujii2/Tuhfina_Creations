import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tuhfina-creations.vercel.app'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin',
                '/dashboard',
                '/api/',
                '/cart',
                '/checkout',
                '/login',
                '/register',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
