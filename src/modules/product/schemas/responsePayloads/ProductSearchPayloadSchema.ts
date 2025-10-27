import {z} from "zod";
import {OmittedProductWithImagesSchema} from "@/modules/product/schemas/ProductSchema";
import {SimplePaginatedSchema} from "@/modules/product/schemas/SimplePaginated";

export const ProductSearchPayloadSchema = z
    .object({
        products: SimplePaginatedSchema(OmittedProductWithImagesSchema).nullable(),
        currency: z.object({
            code: z.string(),
        }),
    })
    .strip();

export type TProductSearchPayload = z.infer<typeof ProductSearchPayloadSchema>
