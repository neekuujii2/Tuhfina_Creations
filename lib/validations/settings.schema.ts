import { z } from "zod";

export const updateSettingsSchema = z.object({
  key: z.string().min(1, "Key is required").max(200),
  value: z.any(),
});

export const festivalConfigSchema = z.object({
  active: z.boolean().optional(),
  bannerText: z.string().min(1).max(300).optional(),
  bannerSubtext: z.string().max(500).optional(),
  bannerImage: z.string().url().optional(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
});

export const categoryOfferSchema = z.object({
  category: z.string().min(1, "Category is required"),
  discountPercent: z.number().min(0).max(100).optional(),
  fixedPrice: z.number().min(0).optional(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  label: z.string().max(100).optional(),
  isFlash: z.boolean().optional(),
});
