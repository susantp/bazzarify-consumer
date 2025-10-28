import {z} from "zod";
import {OmittedProductWithImagesSchema} from "@/modules/product/schemas/ProductSchema";
import {SimplePaginatedSchema} from "@/modules/product/schemas/SimplePaginated";

export const JustForYouProductsPayloadSchema = z
    .object({
        justForYouProducts: z.union([
            SimplePaginatedSchema(OmittedProductWithImagesSchema),
            z.array(z.unknown()).length(0),
        ]).nullable(),
    })
    .strip();
