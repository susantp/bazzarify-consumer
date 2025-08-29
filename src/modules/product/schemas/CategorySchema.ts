import { z } from "zod";
import { ImageSchema } from "@/modules/product/schemas/ImageSchema";

export const CategoryCore = z
  .object({
    uuid: z.uuid(),
    id: z.string().optional(),
    name: z.string(),
    position: z.string().optional(),
    slug: z.string(),
    specifications: z.array(z.string()).optional(),
    attributes: z.array(z.string()).optional(),
  })
  .strict();

export const CategoryListWithImageSchema = CategoryCore.omit({
  id: true,
  position: true,
  specifications: true,
  attributes: true,
})
  .extend({
    images: z.array(ImageSchema).optional(),
  })
  .strict();

export const CategoryRecursiveWithImageSchema: typeof CategoryListWithImageSchema =
  CategoryListWithImageSchema.extend({
    parent: z.lazy(() => CategoryRecursiveWithImageSchema).optional(),
    children: z
      .array(z.lazy(() => CategoryRecursiveWithImageSchema))
      .optional(),
  });
