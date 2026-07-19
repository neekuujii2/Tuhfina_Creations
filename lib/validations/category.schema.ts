import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  image: z.string().url().optional(),
  description: z.string().max(500).optional(),
  department: z.string().max(100).optional(),
  parentCategory: z.string().max(100).optional(),
});
