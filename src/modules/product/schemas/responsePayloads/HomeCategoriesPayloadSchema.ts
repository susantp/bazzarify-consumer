import { z } from "zod";
import { SimplePaginatedSchema } from "@/modules/product/schemas/SimplePaginated";
import { CategoryListWithImageSchema } from "@/modules/product/schemas/CategorySchema";

export const HomeCategoriesPayloadSchema = z
  .object({
    homeCategories: z.union([
      SimplePaginatedSchema(CategoryListWithImageSchema),
      z.array(z.unknown()).length(0),
    ]),
  })
  .strip();
