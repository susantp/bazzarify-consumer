import { z } from "zod";
import { emptyAsNull } from "@/modules/core/utils/zod.util";

export const DataSchema = <T extends z.ZodTypeAny>(payloadItem: T) =>
	z
		.object({
			message: z.string(),
			payload: emptyAsNull(payloadItem),
		})
		.strip();
