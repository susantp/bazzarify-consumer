import { z } from "zod";

export const UserSchema = z
	.object({
		uuid: z.uuid(),
		authType: z.string(),
		name: z.string(),
		email: z.email(),
		phone: z.string().nullable(),
		phone_verified_at: z.string().nullable(),
		email_verified_at: z.string().nullable(),
	})
	.strip();
export const UserUuid = UserSchema.pick({
	uuid: true,
});
export type TUser = z.infer<typeof UserSchema>;
export type TUserUuid = z.infer<typeof UserUuid>;
