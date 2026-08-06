import { z } from "zod";
import { OmittedProductWithImagesSchema } from "@/modules/product/schemas/ProductSchema";
import { SimplePaginatedSchema } from "@/modules/product/schemas/SimplePaginated";

export const PopularProductsPayloadSchema = z
	.object({
		popularProducts: SimplePaginatedSchema(
			OmittedProductWithImagesSchema,
		).nullable(),
	})
	.strip();
