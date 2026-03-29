import { z } from "zod";

export const SearchHistoryPayloadSchema = z
  .object({
    actor: z.object({
      id: z.string().uuid(),
      type: z.enum(["anonymous", "user"]),
    }),
    history: z.array(z.string()),
  })
  .strip();
