import { z } from "zod";
import { ProductWithImageSchema } from "@/modules/product/schemas/ProductWithImageSchema";
import { SimplePaginatedSchema } from "@/modules/product/schemas/SimplePaginated";

export const FlashDealsPayloadSchema = z
  .object({
    flashDeals: SimplePaginatedSchema(ProductWithImageSchema),
  })
  .strict();
