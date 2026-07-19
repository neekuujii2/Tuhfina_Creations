'use client';

import Image, { ImageProps } from 'next/image';
import { optimizeCloudinaryImage } from '@/lib/cloudinaryTransform';

/**
 * Drop-in replacement for next/image that automatically adds
 * f_auto,q_auto transformations to Cloudinary URLs.
 *
 * Local paths (e.g. /photos/foo.jpg) are passed through unchanged
 * so Next.js optimises them as usual.
 */
export default function CloudinaryImage(props: ImageProps) {
  const src = typeof props.src === 'string'
    ? optimizeCloudinaryImage(props.src)
    : props.src;

  return <Image {...props} src={src} />;
}
