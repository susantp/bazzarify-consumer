import {z} from "zod";
import {OmittedProductWithImageSchema} from "@/modules/product/schemas/ProductSchema";
import {SimplePaginatedSchema} from "@/modules/product/schemas/SimplePaginated";

export const FlashDealsPayloadSchema = z
    .object({
        flashDeals: SimplePaginatedSchema(OmittedProductWithImageSchema).nullable(),
    })
    .strip();
