import {z} from "zod";
import {ImageSchema} from "@/modules/product/schemas/ImageSchema";

export const CategoryCore = z
    .object({
        uuid: z.uuid(),
        id: z.string().optional(),
        name: z.string(),
        position: z.string().optional(),
        slug: z.string(),
        image_base_path: z.string(),
        image_base_url: z.string(),
        specifications: z.array(z.string()).optional(),
        attributes: z.array(z.string()).optional(),
    })
    .strict();

export const CategoryWithImageSchema = CategoryCore.pick({
    uuid: true,
    slug: true,
    name: true,
    image_base_path: true,
    image_base_url: true,
})
    .extend({
        images: z.array(ImageSchema).optional(),
    })
    .strip();

export const CategoryRecursiveWithImageSchema: typeof CategoryWithImageSchema =
    CategoryWithImageSchema.extend({
        parent: z.lazy(() => CategoryRecursiveWithImageSchema).optional(),
        children: z
            .array(z.lazy(() => CategoryRecursiveWithImageSchema))
            .optional(),
        images: z.array(ImageSchema).optional()
    });
