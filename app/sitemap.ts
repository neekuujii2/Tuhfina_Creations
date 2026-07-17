import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { CATEGORIES } from '@/lib/types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tuhfina-creations.vercel.app'
    const now = new Date()

    // Static marketing/content routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/shop`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/our-story`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/shipping`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/returns`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
    ]

    // Account / transactional routes (crawlable but lower priority)
    const accountRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/cart`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/checkout`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/register`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/dashboard`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.3,
        },
    ]

    // Category routes
    const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
        url: `${baseUrl}/shop?category=${encodeURIComponent(category)}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
    }))

    // Dynamic Product routes
    let productRoutes: MetadataRoute.Sitemap = []
    try {
        await dbConnect()
        const products = await Product.find({}).select('_id updatedAt').lean()

        productRoutes = products.map((product: any) => ({
            url: `${baseUrl}/product/${product._id}`,
            lastModified: new Date(product.updatedAt || now),
            changeFrequency: 'weekly',
            priority: 0.6,
        }))
    } catch (error) {
        console.error('Sitemap product fetch error:', error)
    }

    return [...staticRoutes, ...accountRoutes, ...categoryRoutes, ...productRoutes]
}

export const dynamic = 'force-dynamic'
