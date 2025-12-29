'use server';

import cloudinary from '../cloudinary';

export async function getCloudinarySignature() {
    const timestamp = Math.round((new Date()).getTime() / 1000);

    // Generate signature
    const signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
    }, cloudinary.config().api_secret!);

    return {
        timestamp,
        signature,
        cloudName: cloudinary.config().cloud_name,
        apiKey: cloudinary.config().api_key
    };
}

export async function deleteCloudinaryImage(publicId: string) {
    try {
        await cloudinary.uploader.destroy(publicId);
        return { success: true };
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        return { success: false, error };
    }
}
