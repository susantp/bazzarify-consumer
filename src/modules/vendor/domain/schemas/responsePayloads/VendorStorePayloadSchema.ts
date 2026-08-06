import { StoreSchema } from "@/modules/vendor/domain/schemas/store";
import { z } from "zod";

export const VendorStorePayloadSchema = z
	.object({
		store: StoreSchema.nullable(),
		currency: z.object({
			code: z.string(),
		}),
	})
	.strip();

export type TVendorStorePayload = z.infer<typeof VendorStorePayloadSchema>;
