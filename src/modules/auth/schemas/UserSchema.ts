import {z} from "zod";

const UserSchema = z
    .object({
        uuid: z.uuid(),
        authType: z.string(),
        name: z.string(),
        email: z.email(),
        phone: z.string(),
        phone_verified_at: z.date().nullable(),
        email_verified_at: z.date().nullable(),
    })
    .strip();

export type TUser = z.infer<typeof UserSchema>;

export default UserSchema;
