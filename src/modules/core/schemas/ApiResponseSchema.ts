import { z } from "zod";
import { DataSchema } from "@/modules/core/schemas/DataSchema";
import { MetaDataSchema } from "@/modules/core/schemas/MetaDataSchema";

export const ApiResponseSchema = <T extends z.ZodTypeAny>(payloadItem: T) =>
	z
		.object({
			data: DataSchema<T>(payloadItem),
			metaData: MetaDataSchema,
		})
		.strip();
