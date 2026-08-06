import { z } from "zod";
import { OmittedProductWithImagesSchema } from "@/modules/product/schemas/ProductSchema";
import { SimplePaginatedSchema } from "@/modules/product/schemas/SimplePaginated";
import { SearchMetadataPayloadSchema } from "@/modules/product/schemas/responsePayloads/SearchMetadataPayloadSchema";

export const ProductSearchPayloadSchema = z
	.object({
		products: SimplePaginatedSchema(OmittedProductWithImagesSchema).nullable(),
		currency: z.object({
			code: z.string(),
		}),
		metadata: SearchMetadataPayloadSchema.nullable().optional(),
	})
	.strip();

export type TProductSearchPayload = z.infer<typeof ProductSearchPayloadSchema>;
