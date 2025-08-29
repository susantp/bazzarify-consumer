import { z } from "zod";
import { ProductWithVariantAndImageSchema } from "@/modules/product/schemas/ProductWithVariantAndImageSchema";

export const ProductShowPayloadSchema = z
  .object({
    product: ProductWithVariantAndImageSchema,
  })
  .strip();
