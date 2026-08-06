import { z } from "zod";
import { UserUuid } from "@/modules/auth/schemas/UserSchema";

export const UserAddress = z.object({
	uuid: z.uuid().optional(),
	street: z.string().nullable(),
	city: z.string().nullable(),
	state: z.string().nullable(),
	zip: z.string().nullable(),
	country: z.string().nullable(),
	phone: z.string().nullable(),
	user_uuid: z.uuid(),
	is_default: z.boolean().default(false),
});
export const TUserAddressUuid = UserAddress.pick({
	uuid: true,
});
export type TUserAddress = z.infer<typeof UserAddress>;
export type TUserAddressUuid = z.infer<typeof UserUuid>;
