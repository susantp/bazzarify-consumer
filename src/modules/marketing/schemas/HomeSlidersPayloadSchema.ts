import { z } from "zod";
import { SimplePaginatedSchema } from "@/modules/product/schemas/SimplePaginated";
import { SliderWithImagesSchema } from "@/modules/marketing/schemas/SliderSchema";

export const HomeSlidersPayloadSchema = z
  .object({
    sliders: SimplePaginatedSchema(SliderWithImagesSchema),
  })
  .strip();

export type THomeSlidersPayload = z.infer<typeof HomeSlidersPayloadSchema>;
