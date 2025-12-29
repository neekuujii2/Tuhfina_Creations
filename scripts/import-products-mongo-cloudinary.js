const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configuration
const MONGODB_URI = process.env.DATABASE_URL;
const CLOUDINARY_CONFIG = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Mongoose Schema (matching models/Product.ts)
const ProductSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    category: String,
    images: [String],
    isCustomizable: Boolean,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function runMigration() {
    if (!MONGODB_URI) {
        console.error('Error: DATABASE_URL not found in environment variables.');
        process.exit(1);
    }

    // Connect to MongoDB
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }

    // Configure Cloudinary
    cloudinary.config(CLOUDINARY_CONFIG);

    const csvFilePath = path.join(__dirname, '../Dataset/Sheet1.csv');
    const localImagesDir = path.join(__dirname, '../Dataset/images');

    if (!fs.existsSync(csvFilePath)) {
        console.error(`CSV file not found at: ${csvFilePath}`);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(csvFilePath);
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
    });

    console.log(`Found ${records.length} records in CSV. Starting import...`);

    for (const record of records) {
        const { title, description, price, category, isCustomizable, images } = record;

        try {
            // 1. Check for existing product (Idempotency)
            const existingProduct = await Product.findOne({ title: title.trim() });
            if (existingProduct) {
                console.log(`[SKIP] Product already exists: "${title}"`);
                continue;
            }

            // 2. Process Images
            const imageSources = images.split('|').map(img => img.trim()).filter(img => img !== '');
            const uploadedUrls = [];

            for (const source of imageSources) {
                // Skip Bing/HTML search result links as requested (they usually break or are invalid direct images)
                if (source.includes('bing.net') || source.includes('search?')) {
                    console.log(`[WARN] Skipping invalid/search image source: ${source}`);
                    continue;
                }

                try {
                    let uploadPath = source;

                    // Check if it's a local file
                    const localPath = path.join(localImagesDir, source);
                    if (fs.existsSync(localPath)) {
                        uploadPath = localPath;
                    }

                    console.log(`[INFO] Uploading image for "${title}": ${source}`);
                    const result = await cloudinary.uploader.upload(uploadPath, {
                        folder: 'tuhfina_migration',
                    });
                    uploadedUrls.push(result.secure_url);
                } catch (uploadErr) {
                    console.error(`[ERROR] Image upload failed for "${title}" (${source}):`, uploadErr.message);
                }
            }

            if (uploadedUrls.length === 0) {
                console.log(`[SKIP] No valid images found for "${title}". skipping.`);
                continue;
            }

            // 3. Save to MongoDB
            await Product.create({
                title: title.trim(),
                description: description.trim(),
                price: parseFloat(price) || 0,
                category: category.trim(),
                isCustomizable: isCustomizable.toLowerCase() === 'true',
                images: uploadedUrls,
            });

            console.log(`[SUCCESS] Imported: "${title}"`);
        } catch (err) {
            console.error(`[CRITICAL] Failed to process row: "${title}"`, err.message);
        }
    }

    console.log('Migration completed!');
    await mongoose.disconnect();
}

runMigration().catch(console.error);
