import { z } from "zod";

export const MetaDataSchema = z
  .object({
    error: z.union([z.string(), z.record(z.string(), z.string())]),
    executionTime: z.number().optional().nullable(),
    errorCode: z.union([z.string(), z.number()]),
  })
  .strict()
  .optional();
