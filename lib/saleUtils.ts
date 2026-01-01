import { Product, CategoryOffer, FestivalConfig } from './types';

export interface SaleStatus {
    currentPrice: number;
    isSaleActive: boolean;
    label: string;
    isFlash: boolean;
    remainingTime?: number; // in milliseconds
}

export const resolveProductPrice = (
    product: Product,
    categoryOffers: CategoryOffer[],
    festivalConfig: FestivalConfig | null
): SaleStatus => {
    const now = new Date();
    const originalPrice = product.price;

    // If global switch is OFF, return normal price
    if (!festivalConfig?.active) {
        return {
            currentPrice: originalPrice,
            isSaleActive: false,
            label: '',
            isFlash: false
        };
    }

    // Check if global festival config exists and is within time range
    const isGlobalActive = festivalConfig.active &&
        now >= new Date(festivalConfig.startAt) &&
        now <= new Date(festivalConfig.endAt);

    if (!isGlobalActive) {
        return {
            currentPrice: originalPrice,
            isSaleActive: false,
            label: '',
            isFlash: false
        };
    }

    const categoryOffer = categoryOffers.find(o => o.category === product.category);

    // 1. Flash Sale (Product Level)
    if (product.festivalOffer?.isFlash) {
        const start = new Date(product.festivalOffer.startAt);
        const end = new Date(product.festivalOffer.endAt);
        if (now >= start && now <= end) {
            return {
                currentPrice: product.festivalOffer.price,
                isSaleActive: true,
                label: product.festivalOffer.label || 'Flash Sale',
                isFlash: true,
                remainingTime: end.getTime() - now.getTime()
            };
        }
    }

    // 2. Flash Sale (Category Level)
    if (categoryOffer?.isFlash) {
        const start = new Date(categoryOffer.startAt);
        const end = new Date(categoryOffer.endAt);
        if (now >= start && now <= end) {
            let flashPrice = originalPrice;
            if (categoryOffer.fixedPrice) flashPrice = categoryOffer.fixedPrice;
            else if (categoryOffer.discountPercent) {
                flashPrice = originalPrice - (originalPrice * categoryOffer.discountPercent / 100);
            }
            return {
                currentPrice: Math.round(flashPrice),
                isSaleActive: true,
                label: categoryOffer.label || 'Flash Sale',
                isFlash: true,
                remainingTime: end.getTime() - now.getTime()
            };
        }
    }

    // 3. Product Festival Offer
    if (product.festivalOffer) {
        const start = new Date(product.festivalOffer.startAt);
        const end = new Date(product.festivalOffer.endAt);
        if (now >= start && now <= end) {
            return {
                currentPrice: product.festivalOffer.price,
                isSaleActive: true,
                label: product.festivalOffer.label || 'Festival Offer',
                isFlash: false
            };
        }
    }

    // 4. Category Festival Offer
    if (categoryOffer) {
        const start = new Date(categoryOffer.startAt);
        const end = new Date(categoryOffer.endAt);
        if (now >= start && now <= end) {
            let festPrice = originalPrice;
            if (categoryOffer.fixedPrice) festPrice = categoryOffer.fixedPrice;
            else if (categoryOffer.discountPercent) {
                festPrice = originalPrice - (originalPrice * categoryOffer.discountPercent / 100);
            }
            return {
                currentPrice: Math.round(festPrice),
                isSaleActive: true,
                label: categoryOffer.label || 'Festival Offer',
                isFlash: false
            };
        }
    }

    // 5. Normal Price
    return {
        currentPrice: originalPrice,
        isSaleActive: false,
        label: '',
        isFlash: false
    };
};
