'use client';

import Image from 'next/image';
import { Upload } from 'lucide-react';

interface CategoryCardProps {
    name: string;
    image?: string;
    onUpdate: (e: React.ChangeEvent<HTMLInputElement>) => void;
    uploading: boolean;
}

export function CategoryCard({ name, image, onUpdate, uploading }: CategoryCardProps) {
    const emoji = name.includes('Flower') ? '🌸' :
        name.includes('Earring') ? '💎' :
            name.includes('Frame') ? '🖼️' :
                name.includes('Keychain') ? '🔑' :
                    name.includes('Diya') ? '🪔' : '🎁';

    return (
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col items-center shadow-soft">
            <div className="relative h-32 w-full mb-4 bg-luxury-gray/10 rounded-xl overflow-hidden flex items-center justify-center">
                {image ? (
                    <Image src={image} alt={name} fill className="object-cover" unoptimized />
                ) : (
                    <span className="text-4xl">{emoji}</span>
                )}
            </div>
            <h3 className="font-serif font-bold text-base text-primary mb-4">{name}</h3>
            <label className={`btn-outline-luxury text-xs py-2 px-4 rounded-full cursor-pointer w-full text-center ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <span>{uploading ? 'Uploading...' : 'Update Thumbnail'}</span>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onUpdate}
                    disabled={uploading}
                />
            </label>
        </div>
    );
}