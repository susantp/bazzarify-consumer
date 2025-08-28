import { z } from "zod";

export const DataSchema = <T extends z.ZodTypeAny>(payloadItem: T) =>
  z
    .object({
      message: z.string(),
      payload: payloadItem,
    })
    .strict();
