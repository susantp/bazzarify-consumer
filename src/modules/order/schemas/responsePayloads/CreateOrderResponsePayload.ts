import {z} from "zod";
import {Cart, OrderTotalsSchema} from "@/modules/order/schemas/orderSchema";

export const CreateOrderResponsePayload = z
    .object({
        cart: Cart.nullable(),
        orderTotals: OrderTotalsSchema
    })
    .strip();

export type TCreateOrderResponsePayload = z.infer<typeof CreateOrderResponsePayload>;
