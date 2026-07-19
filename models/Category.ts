import mongoose, { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a category name'],
            unique: true,
            trim: true,
        },
        image: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
        department: {
            type: String,
            default: 'General',
        },
        parentCategory: {
            type: String,
            required: false,
        },
        slug: {
            type: String,
            required: false,
            unique: true,
            lowercase: true,
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Category = models.Category || model('Category', CategorySchema);

export default Category;
