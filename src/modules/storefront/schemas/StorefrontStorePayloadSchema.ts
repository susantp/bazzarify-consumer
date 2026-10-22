import { z } from "zod";

export const StorefrontStorePayloadSchema = z
  .object({
    store: z
      .object({
        uuid: z.uuid(),
        name: z.string(),
        slug: z.string(),
        short_name: z.string().nullable().optional(),
        short_description: z.string().nullable().optional(),
        email: z.string().nullable().optional(),
        phone: z.string().nullable().optional(),
        country: z.string().nullable().optional(),
        city: z.string().nullable().optional(),
        province: z.string().nullable().optional(),
      })
      .strip(),
    currency: z.object({ code: z.string() }).strip(),
  })
  .strip();
