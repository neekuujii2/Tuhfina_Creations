export const calculateDiscountedPrice = (price: number, settings: any) => {
    if (settings.festivalOfferActive && settings.festivalDiscount) {
        const discountAmount = (price * settings.festivalDiscount) / 100;
        return price - discountAmount;
    }
    return price;
};
