import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { CATEGORIES } from '@/lib/types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tuhfina-creations.vercel.app'

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/shop`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ]

    // Category routes
    const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
        url: `${baseUrl}/shop?category=${encodeURIComponent(category)}`,
        lastModified: new Date(),
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
            lastModified: new Date(product.updatedAt || new Date()),
            changeFrequency: 'weekly',
            priority: 0.6,
        }))
    } catch (error) {
        console.error('Sitemap product fetch error:', error)
    }

    return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
