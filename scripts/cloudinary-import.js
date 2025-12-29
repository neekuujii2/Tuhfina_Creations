const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse'); // You might need to install csv-parse if not already: npm install csv-parse
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env' }); // Load .env file

// --- CONFIGURATION ---
const CLOUDINARY_CONFIG = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY ,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
};

const CSV_PATH = path.join(__dirname, '../dataset/Sheet1.csv');
const IMAGES_DIR = path.join(__dirname, '../dataset/images');
const DRY_RUN = false; // Set to true to test without valid uploads

cloudinary.config(CLOUDINARY_CONFIG);

// --- FIREBASE ADMIN SETUP (Optional for Script if Service Account missing) ---
// Note: To write to Firestore, you need a Service Account.
// If you cannot provide one, this script will log the updates that *would* happen.
let db = null;
try {
    const admin = require('firebase-admin');
    // Check if service account env var is set
    // export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT) {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
            });
        }
        db = admin.firestore();
        console.log("✅ Firebase Admin initialized.");
    } else {
        console.warn("⚠️ Firebase Service Account not found. DB updates will be skipped (logged only). set GOOGLE_APPLICATION_CREDENTIALS to enable.");
    }
} catch (e) {
    console.warn("⚠️ Firebase Admin init failed:", e.message);
}


async function uploadImage(imageSource) {
    try {
        let uploadResult;
        
        // Check if it's a URL or Method
        if (imageSource.startsWith('http')) {
             console.log(`   Downloading and uploading: ${imageSource}`);
             uploadResult = await cloudinary.uploader.upload(imageSource, {
                 folder: 'products_imported',
                 unique_filename: true,
                 fetch_format: 'auto',
                 quality: 'auto'
             });
        } else {
            // Local file
            const localPath = path.join(IMAGES_DIR, imageSource);
            if (!fs.existsSync(localPath)) {
                console.error(`   ❌ Local file not found: ${localPath}`);
                return null;
            }
            console.log(`   Uploading local file: ${localPath}`);
            uploadResult = await cloudinary.uploader.upload(localPath, {
                folder: 'products_imported',
                unique_filename: true,
            });
        }
        
        return uploadResult.secure_url;
    } catch (e) {
        console.error(`   ❌ Upload failed for ${imageSource}:`, e.message);
        return null;
    }
}

async function processRow(row, rowIndex) {
    // Expected Columns matching Product type roughly, or just look for 'image' column
    // Try to find image column (case insensitive)
    const headers = Object.keys(row);
    const imageKey = headers.find(h => h.toLowerCase().includes('image') || h.toLowerCase() === 'url');
    const titleKey = headers.find(h => h.toLowerCase().includes('title') || h.toLowerCase().includes('name'));
    
    if (!imageKey) {
        console.warn(`[Row ${rowIndex}] Skipped: No image column found.`);
        return;
    }

    const imageValue = row[imageKey];
    if (!imageValue) {
        console.warn(`[Row ${rowIndex}] Skipped: Empty image value.`);
        return;
    }
    
    // Check if already cloudinary?
    if (imageValue.includes('cloudinary.com')) {
         console.log(`[Row ${rowIndex}] Already Cloudinary: ${imageValue}`);
         return;
    }

    console.log(`[Row ${rowIndex}] Processing: ${row[titleKey] || 'Product'}...`);
    
    const cloudinaryUrl = await uploadImage(imageValue);
    
    if (cloudinaryUrl) {
        console.log(`   ✅ Uploaded: ${cloudinaryUrl}`);
        
        // Setup Update Object
        const updateData = {
           cloud_image: cloudinaryUrl, // Or replace the original field
           updatedAt: new Date(),
        };
        
        // Save to DB
        // We need an ID. Is there an ID column?
        const idKey = headers.find(h => h.toLowerCase() === 'id' || h.toLowerCase() === '_id');
        const productId = idKey ? row[idKey] : null;

        if (db && productId) {
             const docRef = db.collection('products').doc(productId);
             await docRef.set({
                 images: [cloudinaryUrl] // Replace images array with single string? Or array? User said "Save ONLY the Cloudinary secure_url"
                 // The app expects `images: string[]`.
             }, { merge: true });
             console.log(`   💾 Updated Firestore Product ${productId}`);
        } else if (!productId) {
            console.warn("   ⚠️ No Product ID found in CSV. Cannot update DB.");
        } else {
            console.log("   ⚠️ DB not connected. Manual update required.");
        }
    }
}

async function run() {
    if (!fs.existsSync(CSV_PATH)) {
        console.error(`Fatal: CSV file not found at ${CSV_PATH}`);
        return;
    }

    const fileContent = fs.readFileSync(CSV_PATH, { encoding: 'utf-8' });
    
    parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    }, async (err, records) => {
        if (err) {
            console.error(err);
            return;
        }
        
        console.log(`Found ${records.length} records. Processing...`);
        
        for (let i = 0; i < records.length; i++) {
            await processRow(records[i], i + 1);
        }
        
        console.log("--- Import Finished ---");
    });
}

run();
