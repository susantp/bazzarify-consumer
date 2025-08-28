import { z } from "zod";

export const SimplePaginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z
    .object({
      current_page: z.number().int(),
      current_page_url: z.string(),
      data: z.array(item),
      first_page_url: z.string(),
      from: z.number().int(),
      next_page_url: z.string().nullable(),
      path: z.string(),
      per_page: z.number().int().positive(),
      prev_page_url: z.string().nullable(),
      to: z.number().int(),
    })
    .strict();
