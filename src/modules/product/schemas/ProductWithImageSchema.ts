import { ProductSchema } from "@/modules/product/schemas/ProductSchema";
import { ImageSchema } from "@/modules/product/schemas/ImageSchema";
import { z } from "zod";

export const ProductWithImageSchema = ProductSchema.omit({
  id: true,
  box_items: true,
  specifications: true,
  highlights: true,
  description: true,
})
  .extend({
    images: z.array(ImageSchema).optional(),
  })
  .strict();
