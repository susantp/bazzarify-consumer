import { z } from "zod";
import { VariantSchema } from "@/modules/product/schemas/VariantSchema";

export const OrderItemSchema = z
  .object({
    uuid: z.uuid(),
    order_uuid: z.uuid(),
    orderable_uuid: z.uuid(),
    orderable_type: z.string(),
    sku: z.string(),
    name: z.string(),
    variant_attrs: VariantSchema.pick({
      uuid: true,
      name: true,
      sku: true,
    })
      .strict()
      .nullable(),
    qty_ordered: z.number().int().nonnegative(),
    qty_canceled: z.number().int().nonnegative().default(0),
    qty_shipped: z.number().int().nonnegative().default(0),
    qty_refunded: z.number().int().nonnegative().default(0),

    unit_price: z.number().int().nonnegative(),
    row_discount: z.number().int().nonnegative().default(0),
    row_tax: z.number().int().nonnegative().default(0),
    row_total: z.float64().nonnegative().nonoptional(),

    meta: z.record(z.any(), z.string()).nullable(), // JSON column
    created_at: z.iso.datetime().optional(),
    updated_at: z.iso.datetime().optional(),
    deleted_at: z.iso.datetime().nullable().optional(),
  })
  .strict();
export const OrderSchema = z
  .object({
    uuid: z.uuid(),
    buyer_uuid: z.uuid(),
    buyer_type: z.string(),
    order_number: z.string(),
    status: z.string().max(32),
    sub_total: z.number().int().nonnegative().default(0),
    discount_total: z.number().int().nonnegative().default(0),
    tax_total: z.number().int().nonnegative().default(0),
    shipping_total: z.number().int().nonnegative().default(0),
    grand_total: z.number().int().nonnegative().default(0),
    payment_status: z.string().max(32),
    placed_at: z.iso.datetime(),
    cancelled_at: z.iso.datetime().nullable().optional(),
    completed_at: z.iso.datetime().nullable().optional(),
    created_at: z.iso.datetime().optional().optional(),
    updated_at: z.iso.datetime().optional().optional(),
    deleted_at: z.iso.datetime().nullable().optional(),
  })
  .extend({
    items: z.array(OrderItemSchema),
  })
  .strict();
export const CartItem = OrderItemSchema.pick({
  uuid: true,
  name: true,
  sku: true,
  variant_attrs: true,
  unit_price: true,
  row_discount: true,
  row_tax: true,
  row_total: true,
  qty_ordered: true,
}).strict();

export const CartMeta = OrderSchema.pick({
  buyer_type: true,
  buyer_uuid: true,
  placed_at: true,
  sub_total: true,
  discount_total: true,
  tax_total: true,
  shipping_total: true,
  grand_total: true,
}).strict();

export const Cart = z
  .object()
  .extend(CartMeta.shape)
  .extend({
    items: z.array(CartItem).nonempty(),
  })
  .strict()
  .nullable();

export type TOrder = z.infer<typeof OrderSchema>;
export type TOrderItem = z.infer<typeof OrderItemSchema>;
export type TCart = z.infer<typeof Cart>;
export type TCartMeta = z.infer<typeof CartMeta>;
export type TCartItem = z.infer<typeof CartItem>;
