import mongoose, { Schema, model, models } from 'mongoose';

const CategoryOfferSchema = new Schema(
    {
        category: {
            type: String,
            required: true,
            unique: true,
        },
        discountPercent: Number,
        fixedPrice: Number,
        startAt: {
            type: Date,
            required: true,
        },
        endAt: {
            type: Date,
            required: true,
        },
        label: String,
        isFlash: Boolean,
    },
    {
        timestamps: true,
    }
);

const CategoryOffer = models.CategoryOffer || model('CategoryOffer', CategoryOfferSchema);

export default CategoryOffer;
