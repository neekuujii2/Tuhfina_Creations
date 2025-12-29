import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary server-side
// Strictly use environment variables for security
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

/**
 * Uploads an image to Cloudinary
 * @param fileIdentifier - Can be a local file path, a base64 string, or a remote URL
 * @returns The secure URL of the uploaded image
 */
export async function uploadImage(fileIdentifier: string): Promise<string> {
    try {
        const result = await cloudinary.uploader.upload(fileIdentifier, {
            folder: 'tuhfina_creations',
        });
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
}

export default cloudinary;
