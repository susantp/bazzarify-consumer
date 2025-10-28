import { z } from "zod";
import { SimplePaginatedSchema } from "@/modules/product/schemas/SimplePaginated";
import { CategoryWithImageSchema } from "@/modules/product/schemas/CategorySchema";

export const HomeCategoriesPayloadSchema = z
  .object({
    homeCategories: SimplePaginatedSchema(CategoryWithImageSchema),
  })
  .strip();
