import { z } from "zod";

export const StoreSchema = z
	.object({
		uuid: z.uuid(),
		user_uuid: z.uuid(),
		name: z.string(),
		slug: z.string(),
		short_name: z.string().nullable(),
		short_description: z.string().nullable(),
		email: z.email(),
		phone: z.string(),
		country: z.string().nullable(),
		city: z.string().nullable(),
		province: z.string().nullable(),
		created_at: z.string().optional(),
		updated_at: z.string().nullable().optional(),
		deleted_at: z.string().optional().nullable(),
	})
	.strip();
export type TStoreSchema = z.infer<typeof StoreSchema>;
