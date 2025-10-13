import {z} from "zod";
import {Cart} from "@/modules/order/schemas/orderSchema";

export const CartResponsePayload = z
    .object({
        cart: Cart.nullable(),
    })
    .strip();

export type TAddCartPayload = z.infer<typeof CartResponsePayload>;
