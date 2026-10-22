import { z } from "zod";
import { ImageSchema } from "@/modules/product/schemas/ImageSchema";
import { VariantListWithImageSchema } from "@/modules/product/schemas/VariantSchema";
import { ProductSchema } from "@/modules/product/schemas/ProductSchema";

export const ProductWithVariantAndImageSchema = ProductSchema.extend({
  images: z.array(ImageSchema).optional().or(z.array(z.unknown())),
}).extend({
  variants: z.array(VariantListWithImageSchema).nullable(),
});

export type ProductWithVariantAndImageType = z.infer<
  typeof ProductWithVariantAndImageSchema
>;
