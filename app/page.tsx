import dbConnect from '@/lib/mongodb';
import CategoryModel from '@/models/Category';
import ProductModel from '@/models/Product';
import CategoryOfferModel from '@/models/CategoryOffer';
import SettingsModel from '@/models/Settings';
import FestivalConfigModel from '@/models/FestivalConfig';
import HomeClient from '@/components/home/HomeClient';
import { Product, Category, CategoryOffer, FestivalConfig } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    let categories: Category[] = [];
    let products: Product[] = [];
    let settings: any = {};
    let festivalConfig: FestivalConfig | null = null;
    let categoryOffers: CategoryOffer[] = [];

    try {
        await dbConnect();
        
        // Fetch categories, products, settings, festival, and category offers
        const [categoriesData, productsData, settingsData, festivalConfigData, categoryOffersData] = await Promise.all([
            CategoryModel.find({}).lean(),
            ProductModel.find({}).sort({ createdAt: -1 }).limit(8).lean(),
            SettingsModel.find({}).lean(),
            FestivalConfigModel.findOne({}).lean(),
            CategoryOfferModel.find({}).lean(),
        ]);

        categories = JSON.parse(JSON.stringify(categoriesData));
        
        // Parse DB products, mapping _id to id for the frontend TS types
        products = (productsData as any[]).map((p) => ({
            ...p,
            id: p._id.toString(),
            _id: p._id.toString(),
            createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
        }));

        settings = settingsData.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        
        festivalConfig = festivalConfigData ? JSON.parse(JSON.stringify(festivalConfigData)) : null;
        categoryOffers = JSON.parse(JSON.stringify(categoryOffersData));
    } catch (error) {
        console.error('Error fetching home data:', error);
    }

    return (
        <HomeClient
            products={products}
            categories={categories}
            settings={settings}
            festivalConfig={festivalConfig}
            categoryOffers={categoryOffers}
        />
    );
}
