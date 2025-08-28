import { z } from "zod";

export const ImageSchema = z
  .object({
    uuid: z.string(),
    file: z.string(),
    pivot: z
      .object({
        imageable_uuid: z.string(),
        imageable_type: z.string(),
        image_uuid: z.string(),
        created_at: z.string().nullable(),
        updated_at: z.string().nullable(),
        deleted_at: z.string().nullable(),
      })
      .optional(),
  })
  .strict();
