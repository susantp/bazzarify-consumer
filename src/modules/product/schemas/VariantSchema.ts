import { z } from "zod";
import { ProductSchema } from "@/modules/product/schemas/ProductSchema";
import { ImageSchema } from "@/modules/product/schemas/ImageSchema";

export const VariantSchema = z
	.object({
		uuid: z.uuid(),
		product_uuid: z.uuid(),
		name: z.string(),
		sku: z.string().min(8),
		price: z.number(),
		stock: z.number().int(),
		available: z.boolean(),
		available_to_sell: z.number().int().nonnegative(),
		image_base_path: z.string(),
		image_base_url: z.string(),
		product: ProductSchema,
	})
	.strip();
export const VariantListWithImageSchema = VariantSchema.extend({
	images: z.array(ImageSchema),
}).strip();
export type VariantType = z.infer<typeof VariantSchema>;
export type VariantListWithImageType = z.infer<
	typeof VariantListWithImageSchema
>;
