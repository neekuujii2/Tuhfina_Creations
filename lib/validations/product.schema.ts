import { z } from "zod";

const festivalOfferSchema = z
  .object({
    price: z.number().min(0).optional(),
    startAt: z.coerce.date().optional(),
    endAt: z.coerce.date().optional(),
    label: z.string().max(100).optional(),
    isFlash: z.boolean().optional(),
  })
  .optional();

export const createProductSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be non-negative"),
  category: z.string().min(1, "Category is required"),
  department: z.string().max(100).optional(),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  isCustomizable: z.boolean().optional(),
  festivalOffer: festivalOfferSchema,
  stock: z.number().int().min(0).optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
});

export const updateProductSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  category: z.string().min(1).optional(),
  department: z.string().max(100).optional(),
  images: z.array(z.string().url()).min(1).optional(),
  isCustomizable: z.boolean().optional(),
  festivalOffer: festivalOfferSchema,
  stock: z.number().int().min(0).optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
});
