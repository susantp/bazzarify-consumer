import { z } from "zod";
import { UserSchema } from "@/modules/auth/schemas/UserSchema";
import { ImageSchema } from "@/modules/product/schemas/ImageSchema";

const SliderImageSchema = ImageSchema.extend({
  pivot: z.object({
    imageable_uuid: z.uuid(),
    imageable_type: z.string(),
    image_uuid: z.uuid(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable(),
    deleted_at: z.string().nullable(),
  }),
});

export const SliderWithImagesSchema = z
  .object({
    uuid: z.uuid(),
    title: z.string().min(2).max(50),
    link: z.url().nullable().optional(),
    status: z.enum(["active", "inactive"]),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    owner: UserSchema.nullable(),
    image_base_path: z.string(),
    image_base_url: z.string(),
    images: z.array(SliderImageSchema).optional(),
  })
  .strip();

export type TSliderWithImages = z.infer<typeof SliderWithImagesSchema>;
