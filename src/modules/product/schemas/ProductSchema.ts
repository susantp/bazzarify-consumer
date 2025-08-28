import { z } from "zod";

export const ProductSchema = z
  .object({
    type: z.enum(["retail", "wholesale"]),
    uuid: z.string(),
    image_base_path: z.string().optional(),
    image_base_url: z.string().optional(),
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    base_price: z.number().nonnegative(),
    description: z.string().optional(),
    highlights: z.string().optional(),
    box_items: z.string().optional(),
    status_text: z.string(),
    status: z.number().nonnegative(),
    specifications: z.record(z.string(), z.string()),
  })
  .strict();
