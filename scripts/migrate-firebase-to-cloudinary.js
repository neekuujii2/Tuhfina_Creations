const admin = require('firebase-admin');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
require('dotenv').config({ path: '.env' });

// --- CONFIGURATION ---
const CLOUDINARY_CONFIG = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.config(CLOUDINARY_CONFIG);

// --- FIREBASE ADMIN SETUP ---
// You MUST provide a service account JSON file and set FIREBASE_SERVICE_ACCOUNT path in .env
// OR ensure GOOGLE_APPLICATION_CREDENTIALS points to it.
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.error("❌ Fatal: Firebase Service Account not found. Set GOOGLE_APPLICATION_CREDENTIALS in .env");
    process.exit(1);
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
}
const db = admin.firestore();

async function migrateUrl(url) {
    if (!url || !url.includes('firebasestorage.googleapis.com')) {
        return url; // Already migrated or not firebase
    }

    try {
        console.log(`   🔄 Migrating: ${url.substring(0, 50)}...`);
        // We can upload to Cloudinary directly from a URL
        const result = await cloudinary.uploader.upload(url, {
            folder: 'products_migrated',
        });
        return result.secure_url;
    } catch (error) {
        console.error(`   ❌ Failed to migrate ${url}:`, error.message);
        return url; // Keep old URL on failure
    }
}

async function runMigration() {
    console.log("🚀 Starting Firebase to Cloudinary Migration...");

    try {
        const productsSnapshot = await db.collection('products').get();
        console.log(`Found ${productsSnapshot.size} products.`);

        for (const productDoc of productsSnapshot.docs) {
            const product = productDoc.data();
            const images = product.images || [];
            let updated = false;
            const newImages = [];

            console.log(`Processing Product: ${product.title || productDoc.id}`);

            for (const imgUrl of images) {
                const newUrl = await migrateUrl(imgUrl);
                if (newUrl !== imgUrl) {
                    updated = true;
                }
                newImages.push(newUrl);
            }

            if (updated) {
                await productDoc.ref.update({ images: newImages });
                console.log(`   ✅ Updated Firestore for ${productDoc.id}`);
            } else {
                console.log(`   ⏩ No migration needed for ${productDoc.id}`);
            }
        }

        console.log("\n--- Migration Completed successfully ---");
    } catch (error) {
        console.error("Fatal Migration Error:", error);
    }
}

runMigration();
