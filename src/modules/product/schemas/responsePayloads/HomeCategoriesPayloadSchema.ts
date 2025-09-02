import { z } from "zod";
import { SimplePaginatedSchema } from "@/modules/product/schemas/SimplePaginated";
import { CategoryListWithImageSchema } from "@/modules/product/schemas/CategorySchema";

export const HomeCategoriesPayloadSchema = z
  .object({
    homeCategories: SimplePaginatedSchema(CategoryListWithImageSchema),
  })
  .strip();
