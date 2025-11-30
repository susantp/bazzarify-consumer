import {z} from "zod";
import {StoreSchema} from "@/modules/vendor/domain/schemas/store";

export const VendorStorePayloadSchema = z.object({
    store: StoreSchema,
    currency: z.object({
        code: z.string(),
    }),
}).strip();

export type TVendorStorePayload = z.infer<typeof VendorStorePayloadSchema>;