import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide a description'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide a price'],
        },
        category: {
            type: String,
            required: [true, 'Please provide a category'],
        },
        images: {
            type: [String],
            required: [true, 'Please provide at least one image URL'],
        },
        isCustomizable: {
            type: Boolean,
            default: false,
        },
        festivalOffer: {
            price: Number,
            startAt: Date,
            endAt: Date,
            label: String,
            isFlash: Boolean,
        },
    },
    {
        timestamps: true,
    }
);

const Product = models.Product || model('Product', ProductSchema);

export default Product;
