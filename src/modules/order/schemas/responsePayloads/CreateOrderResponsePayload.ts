import { z } from "zod";
import { Cart, OrderTotalsSchema } from "@/modules/order/schemas/orderSchema";

export const CreateOrderResponsePayload = z
  .object({
    cart: Cart.nullable(),
    orderTotals: OrderTotalsSchema.extend({
      payment_method: z.literal("cod"),
      payment_status: z.enum([
        "pending",
        "authorized",
        "captured",
        "paid",
        "failed",
        "refunded",
        "partially_refunded",
      ]),
      store_allocations: z.array(
        z
          .object({
            store_uuid: z.uuid(),
            amount_minor: z.number().int().nonnegative(),
            method: z.literal("cod"),
            status: z.enum(["pending", "collected"]),
          })
          .strip(),
      ),
    }),
  })
  .strip();

export type TCreateOrderResponsePayload = z.infer<
  typeof CreateOrderResponsePayload
>;
