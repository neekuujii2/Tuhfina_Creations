'use client';

export const dynamic = 'force-dynamic';

import useSWR, { useSWRConfig } from 'swr';
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { CATEGORIES } from '@/lib/types';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SortableCategoryCard } from '@/components/admin/SortableCategoryCard';
import { CategoryCardSkeleton } from '@/components/admin/skeletons/AdminSkeletons';
import { EmptyState } from '@/components/admin/EmptyState';

const jewelleryCollections = [
    'Rings',
    'Earrings',
    'Necklaces',
    'Bracelets',
    'Mangalsutra',
    'Wedding Collection',
];

const ALL_ADMIN_CATEGORIES = [
    ...CATEGORIES,
    ...jewelleryCollections
];

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CategoriesPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const { mutate } = useSWRConfig();

    const { data: categories = [], error: categoriesError, isLoading: categoriesLoading } = useSWR<any[]>('/api/categories', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 5000,
    });

    const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', description: '', image: '' });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleCategoryImageUpdate = useCallback(async (categoryName: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingCategory(categoryName);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadRes.ok) throw new Error('Failed to upload image');
            const uploadData = await uploadRes.json();
            const imageUrl = uploadData.urls[0];

            const saveRes = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: categoryName,
                    image: imageUrl,
                }),
            });

            if (!saveRes.ok) throw new Error('Failed to save category');
            toast('Category image updated successfully', 'success');
            mutate('/api/categories');
        } catch (error) {
            console.error('Error updating category image:', error);
            toast('Failed to update category image', 'error');
        } finally {
            setUploadingCategory(null);
        }
    }, [toast, mutate]);

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                toast('Category created successfully', 'success');
                setShowCreateModal(false);
                setFormData({ name: '', description: '', image: '' });
                mutate('/api/categories');
            } else {
                throw new Error('Failed to create category');
            }
        } catch (error) {
            toast('Failed to create category', 'error');
        }
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;
        try {
            const res = await fetch('/api/categories', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingCategory._id, ...formData }),
            });
            if (res.ok) {
                toast('Category updated successfully', 'success');
                setEditingCategory(null);
                setFormData({ name: '', description: '', image: '' });
                mutate('/api/categories');
            } else {
                throw new Error('Failed to update category');
            }
        } catch (error) {
            toast('Failed to update category', 'error');
        }
    };

    const handleDeleteCategory = async () => {
        if (!deleteCategoryId) return;
        try {
            const res = await fetch(`/api/categories?id=${deleteCategoryId}`, { method: 'DELETE' });
            if (res.ok) {
                toast('Category deleted successfully', 'success');
                mutate('/api/categories');
            } else {
                throw new Error('Failed to delete category');
            }
        } catch (error) {
            toast('Failed to delete category', 'error');
        } finally {
            setDeleteCategoryId(null);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = categories.findIndex((c: any) => c._id === active.id);
        const newIndex = categories.findIndex((c: any) => c._id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const newCategories = [...categories];
        const [moved] = newCategories.splice(oldIndex, 1);
        newCategories.splice(newIndex, 0, moved);

        await Promise.all(
            newCategories.map((cat: any, index: number) =>
                fetch('/api/categories', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: cat._id, order: index }),
                })
            )
        );
        mutate('/api/categories');
        toast('Category order updated', 'success');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" />
            </div>
        );
    }

    if (!user || !isAdmin) {
        return null;
    }

    if (categoriesLoading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div>
                        <div className="h-8 w-48 bg-luxury-gray/30 rounded-lg animate-pulse mb-2" />
                        <div className="h-3 w-32 bg-luxury-gray/20 rounded-full animate-pulse" />
                    </div>
                    <div className="h-10 w-40 bg-luxury-gray/20 rounded-full animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <CategoryCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (categoriesError) {
        return (
            <div className="text-center py-16">
                <p className="text-red-600 font-semibold">Failed to load categories</p>
                <button onClick={() => mutate('/api/categories')} className="mt-4 btn-outline-luxury">Retry</button>
            </div>
        );
    }

    const dbCategoryNames = categories.map((c: any) => c.name.toLowerCase());
    const missingHardcoded = ALL_ADMIN_CATEGORIES.filter((cat) => !dbCategoryNames.includes(cat.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-primary">Category Media Management</h2>
                    <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
                        {categories.length + missingHardcoded.length} categories
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="luxury"
                        className="flex items-center gap-1.5 py-2 px-4 rounded-full"
                        onClick={() => {
                            setEditingCategory(null);
                            setFormData({ name: '', description: '', image: '' });
                            setShowCreateModal(true);
                        }}
                    >
                        Create New Category
                    </Button>
                </div>
            </div>

            {categories.length === 0 ? (
                <EmptyState
                    icon="categories"
                    title="No categories yet"
                    description="Create your first category to organize your products."
                    ctaLabel="Create Category"
                    onCta={() => {
                        setEditingCategory(null);
                        setFormData({ name: '', description: '', image: '' });
                        setShowCreateModal(true);
                    }}
                />
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={categories.map((c: any) => c._id)} strategy={verticalListSortingStrategy}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((cat: any) => (
                                <div key={cat._id} className="relative group">
                                    <SortableCategoryCard
                                        id={cat._id}
                                        name={cat.name}
                                        image={cat.image}
                                        onUpdate={(e) => handleCategoryImageUpdate(cat.name, e)}
                                        uploading={uploadingCategory === cat.name}
                                    />
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition z-10">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full bg-white border border-border"
                                            onClick={() => {
                                                setEditingCategory(cat);
                                                setFormData({ name: cat.name, description: cat.description || '', image: cat.image || '' });
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full bg-white border border-red-200 text-red-600"
                                            onClick={() => {
                                                setDeleteCategoryId(cat._id);
                                                setDeleteConfirmOpen(true);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                    {cat.description && (
                                        <p className="text-[10px] text-text-secondary mt-2 text-center line-clamp-1">{cat.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogHeader onClose={() => setShowCreateModal(false)}>
                    <DialogTitle>Create New Category</DialogTitle>
                    <DialogDescription>Add a new product category to the storefront.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Category Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-luxury"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input-luxury rounded-2xl"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Image URL</label>
                        <input
                            type="text"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="input-luxury"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline-luxury" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                        <Button type="submit" variant="luxury">Create Category</Button>
                    </DialogFooter>
                </form>
            </Dialog>

            <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
                <DialogHeader onClose={() => setEditingCategory(null)}>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>Update category details.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateCategory} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Category Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-luxury"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input-luxury rounded-2xl"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Image URL</label>
                        <input
                            type="text"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="input-luxury"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline-luxury" onClick={() => setEditingCategory(null)}>Cancel</Button>
                        <Button type="submit" variant="luxury">Save Changes</Button>
                    </DialogFooter>
                </form>
            </Dialog>

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Delete Category"
                description="Are you sure? Products in this category will become uncategorized."
                confirmLabel="Delete"
                onConfirm={handleDeleteCategory}
            />
        </div>
    );
}