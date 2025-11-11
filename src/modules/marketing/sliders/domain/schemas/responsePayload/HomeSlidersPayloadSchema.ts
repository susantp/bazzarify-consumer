import {z} from "zod";
import {SimplePaginatedSchema} from "@/modules/product/schemas/SimplePaginated";
import {SliderSchema, SliderWithImagesSchema} from "@/modules/marketing/sliders/domain/schemas/SliderSchema";

export const HomeSlidersPayloadSchema = z
    .object({
        sliders: SimplePaginatedSchema(SliderWithImagesSchema),
    })
    .strip();
