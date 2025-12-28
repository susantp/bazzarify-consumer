import {z} from "zod";
import {AttributeSchema, AttributeValueSchema} from "@/modules/product/schemas/AttributeSchema";
import {CategoryCore} from "@/modules/product/schemas/CategorySchema";

export const SearchMetadataPayloadSchema = z
    .object({
        attributes: z.array(
            AttributeSchema
                .pick({
                    uuid: true,
                    name: true,
                })
                .extend({
                    values: z.array(
                        AttributeValueSchema
                            .pick({
                                uuid: true,
                            })
                            .extend({
                                value: z.string().min(1),
                            })
                    ),
                })
        ).nullable(),
        categories: z.array(
            CategoryCore.pick({
                uuid: true,
                name: true,
                slug: true,
            })
        ).nullable(),
        price_range: z.object({
            min: z.number().nonnegative(),
            max: z.number().nonnegative(),
        }).nullable(),
    })
    .strip();

export type TSearchMetadataPayloadSchema = z.infer<typeof SearchMetadataPayloadSchema>