import { z } from "zod";

const SchemaIssueSchema = z.object({
  path: z.string(),
  message: z.string(),
  code: z.string(),
});

export const MetaDataSchema = z
  .object({
    // Backend: MetaDataDTO and bootstrap/app.php emit strings, keyed records, or null.
    error: z
      .union([
        z.string(),
        z.record(z.string(), z.unknown()),
        z.array(SchemaIssueSchema),
      ])
      .nullable(),
    executionTime: z.number().nullable().optional(),
    errorCode: z.number().nullable(),
  })
  .strip();
