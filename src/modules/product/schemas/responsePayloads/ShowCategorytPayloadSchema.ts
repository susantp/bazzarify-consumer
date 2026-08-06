import { z } from "zod";
import { CategoryRecursiveWithImageSchema } from "@/modules/product/schemas/CategorySchema";
import { OmittedProductWithImagesSchema } from "@/modules/product/schemas/ProductSchema";
import { ImageSchema } from "@/modules/product/schemas/ImageSchema";
import { SimplePaginatedSchema } from "@/modules/product/schemas/SimplePaginated";

const CategoryBrowsePayloadSchema = z
	.object({
		current_category: CategoryRecursiveWithImageSchema.extend({
			images: z.array(ImageSchema).optional().nullable(),
		}),
		path: z.array(
			CategoryRecursiveWithImageSchema.extend({
				images: z.array(ImageSchema).optional().nullable(),
			}),
		),
		child_categories: z
			.array(
				CategoryRecursiveWithImageSchema.extend({
					images: z.array(ImageSchema).optional().nullable(),
				}),
			)
			.nullable()
			.optional(),
		products: SimplePaginatedSchema(OmittedProductWithImagesSchema).nullable(),
		product_aggregation: z.literal("self_and_descendants"),
	})
	.strip();

export const ShowCategoryPayloadSchema = z
	.object({
		category: CategoryRecursiveWithImageSchema.extend({
			products: z.array(OmittedProductWithImagesSchema).optional().nullable(),
			images: z.array(ImageSchema).optional().nullable(),
		}),
		browse: CategoryBrowsePayloadSchema.optional(),
	})
	.strip();

export type TShowCategoryPayloadSchema = z.infer<
	typeof ShowCategoryPayloadSchema
>;
