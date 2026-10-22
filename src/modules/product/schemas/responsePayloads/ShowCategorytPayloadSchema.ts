import {z} from "zod";
import {CategoryRecursiveWithImageSchema} from "@/modules/product/schemas/CategorySchema";
import {OmittedProductWithImagesSchema} from "@/modules/product/schemas/ProductSchema";
import {ImageSchema} from "@/modules/product/schemas/ImageSchema";

export const ShowCategoryPayloadSchema = z
    .object({
        category: CategoryRecursiveWithImageSchema.extend({
            products: z.array(OmittedProductWithImagesSchema).optional().nullable(),
            images: z.array(ImageSchema).optional().nullable()
        }),
    })
    .strip();

export type TShowCategoryPayloadSchema = z.infer<
    typeof ShowCategoryPayloadSchema
>;
