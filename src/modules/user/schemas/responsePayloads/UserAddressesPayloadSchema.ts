import {z} from "zod";
import {UserAddress} from "@/modules/user/schemas/UserSchema";

export const UserAddressesPayloadSchema = z
    .object({
        addresses: z.array(UserAddress).nullable(),
    })
    .strict();

export type TUserAddressesPayload = z.infer<typeof UserAddress>;