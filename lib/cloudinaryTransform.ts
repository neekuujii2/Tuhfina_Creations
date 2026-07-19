/**
 * Ensure a Cloudinary image URL includes f_auto,q_auto for
 * auto-format (WebP/AVIF) and auto-quality delivery.
 *
 * Works with URLs like:
 *   https://res.cloudinary.com/<cloud>/image/upload/v123/foo.jpg
 *   https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto/v123/foo.jpg
 *
 * If the URL is not a Cloudinary image URL it is returned unchanged.
 */
export function optimizeCloudinaryImage(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  // Already optimized
  if (url.includes('f_auto') && url.includes('q_auto')) return url;

  // Split on /upload/ so we can inject transforms before the version/filename
  const uploadIdx = url.indexOf('/upload/');
  if (uploadIdx === -1) return url;

  const before = url.slice(0, uploadIdx + '/upload/'.length);
  const after = url.slice(uploadIdx + '/upload/'.length);

  // If transforms already exist, skip
  if (after.startsWith('f_') || after.startsWith('q_')) return url;

  return `${before}f_auto,q_auto/${after}`;
}

/**
 * Ensure a Cloudinary video URL includes f_auto,q_auto for
 * auto-format and auto-quality adaptive bitrate delivery.
 */
export function optimizeCloudinaryVideo(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  if (url.includes('f_auto') && url.includes('q_auto')) return url;

  const uploadIdx = url.indexOf('/upload/');
  if (uploadIdx === -1) return url;

  const before = url.slice(0, uploadIdx + '/upload/'.length);
  const after = url.slice(uploadIdx + '/upload/'.length);

  if (after.startsWith('f_') || after.startsWith('q_')) return url;

  return `${before}f_auto,q_auto/${after}`;
}

/**
 * Build a Cloudinary video URL for a given public ID.
 * Used when migrating local /public/videos/*.mp4 to Cloudinary hosting.
 *
 * Example: cloudinaryVideoUrl('hero/crafting-process')
 *   → https://res.cloudinary.com/dooekmus2/video/upload/f_auto,q_auto/hero/crafting-process.mp4
 */
export function cloudinaryVideoUrl(publicId: string): string {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dooekmus2';
  return `https://res.cloudinary.com/${cloud}/video/upload/f_auto,q_auto/${publicId}.mp4`;
}
