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
        department: {
            type: String,
            default: 'General',
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
        stock: {
            type: Number,
            default: 0,
            min: 0,
        },
        metaTitle: {
            type: String,
            required: false,
            maxlength: 60,
        },
        metaDescription: {
            type: String,
            required: false,
            maxlength: 160,
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'hidden'],
            default: 'published',
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product = models.Product || model('Product', ProductSchema);

export default Product;
