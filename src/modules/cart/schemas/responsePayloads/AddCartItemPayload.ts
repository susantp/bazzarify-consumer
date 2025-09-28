import {z} from "zod";
import {CartItem} from "@/modules/order/schemas/orderSchema";

export const AddCartItemPayload = z
    .object({
        cart: z
            .object({
                items: z.array(CartItem),
            })
            .nullable(),
    })
    .strip();

export type TAddCartItemPayload = z.infer<typeof AddCartItemPayload>;
