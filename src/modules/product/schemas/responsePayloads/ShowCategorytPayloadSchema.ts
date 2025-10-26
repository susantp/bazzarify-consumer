import {z} from "zod";
import {CategoryRecursiveWithImageSchema} from "@/modules/product/schemas/CategorySchema";
import {OmittedProductWithImageSchema} from "@/modules/product/schemas/ProductSchema";

export const ShowCategoryPayloadSchema = z
    .object({
        category: CategoryRecursiveWithImageSchema.extend({
            products: z.array(OmittedProductWithImageSchema).optional().nullable()
        }),
    })
    .strip();

export type TShowCategoryPayloadSchema = z.infer<
    typeof ShowCategoryPayloadSchema
>;
