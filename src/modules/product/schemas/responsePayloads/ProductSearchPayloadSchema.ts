import {z} from "zod";
import {OmittedProductWithImageSchema} from "@/modules/product/schemas/ProductSchema";
import {SimplePaginatedSchema} from "@/modules/product/schemas/SimplePaginated";

export const ProductSearchPayloadSchema = z
    .object({
        products: SimplePaginatedSchema(OmittedProductWithImageSchema).nullable(),
        currency: z.object({
            code: z.string(),
        }),
    })
    .strip();

export type TProductSearchPayload = z.infer<typeof ProductSearchPayloadSchema>
