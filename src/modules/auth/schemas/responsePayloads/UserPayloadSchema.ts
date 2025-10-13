import {z} from "zod";
import {UserSchema} from "@/modules/auth/schemas/UserSchema";

export const UserPayloadSchema = z
    .object({
        user: UserSchema,
    })
    .strip();
