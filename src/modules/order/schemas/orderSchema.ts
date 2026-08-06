import { z } from "zod";
import { VariantSchema } from "@/modules/product/schemas/VariantSchema";

export const OrderItemSchema = z
	.object({
		line_id: z.string(),
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
			.strip()
			.nullable(),
		qty_ordered: z.number().int().nonnegative(),
		qty_canceled: z.number().int().nonnegative().default(0),
		qty_shipped: z.number().int().nonnegative().default(0),
		qty_refunded: z.number().int().nonnegative().default(0),

		unit_price: z.float64().nonnegative(),
		row_discount: z.float64().nonnegative().default(0),
		row_tax: z.float64().nonnegative().default(0),
		row_shipping: z.float64().nonnegative().default(0),
		row_total: z.float64().nonnegative().nonoptional(),
		inventory: z
			.object({
				available_to_sell: z.number().int().nonnegative(),
				max_quantity: z.number().int().nonnegative(),
				can_increment: z.boolean(),
			})
			.nullable()
			.optional(),

		meta: z.record(z.any(), z.string()).nullable(), // JSON column
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		deleted_at: z.string().nullable().optional(),
	})
	.strip();
export const OrderSchema = z
	.object({
		uuid: z.uuid(),
		buyer_uuid: z.uuid(),
		buyer_type: z.string(),
		order_number: z.string(),
		status: z.string().max(32),
		items_count: z.number().int().nonnegative().default(0),
		items_quantity: z.number().int().nonnegative().default(0),
		sub_total: z.float64().nonnegative().default(0),
		discount_total: z.float64().nonnegative().default(0),
		tax_total: z.float64().nonnegative().default(0),
		shipping_total: z.float64().nonnegative().default(0),
		grand_total: z.float64().nonnegative().default(0),
		payment_status: z.string().max(32),
		payment_fee: z.float64().nonnegative().default(0),
		placed_at: z.string(),
		cancelled_at: z.string().nullable().optional(),
		completed_at: z.string().nullable().optional(),
		created_at: z.string().optional().optional(),
		updated_at: z.string().optional().optional(),
		deleted_at: z.string().nullable().optional(),
	})
	.extend({
		items: z.array(OrderItemSchema),
	})
	.strip();

export const OrderTotalsSchema = OrderSchema.pick({
	sub_total: true,
	discount_total: true,
	tax_total: true,
	shipping_total: true,
	grand_total: true,
	payment_fee: true,
}).strip();
export const CartItem = OrderItemSchema.pick({
	line_id: true,
	uuid: true,
	name: true,
	sku: true,
	variant_attrs: true,
	inventory: true,
	unit_price: true,
	row_discount: true,
	row_tax: true,
	row_shipping: true,
	row_total: true,
	qty_ordered: true,
}).strip();

export const CartMeta = OrderSchema.pick({
	sub_total: true,
	discount_total: true,
	tax_total: true,
	shipping_total: true,
	grand_total: true,
	payment_fee: true,
	items_count: true,
	items_quantity: true,
}).strip();

export const Cart = z
	.object({
		items: z.array(CartItem),
		totals: CartMeta,
	})
	.strip()
	.nullable();
export const CartItemToUpdateQuantitySchema = CartItem.pick({
	line_id: true,
	uuid: true,
	variant_attrs: true,
	qty_ordered: true,
});
export const GetOrder = OrderSchema.pick({
	order_number: true,
	status: true,
	placed_at: true,
})
	.extend({
		uuid: z.uuid(),
		items: z.array(
			OrderItemSchema.pick({
				uuid: true,
				name: true,
				qty_ordered: true,
			})
				.extend({
					order_uuid: z.uuid(),
				})
				.strip(),
		),
	})
	.strip();
export type TOrder = z.infer<typeof OrderSchema>;
export type TOrderItem = z.infer<typeof OrderItemSchema>;
export type TCart = z.infer<typeof Cart>;
export type TCartMeta = z.infer<typeof CartMeta>;
export type TCartItem = z.infer<typeof CartItem>;
export type TCartItemToUpdateQuantity = z.infer<
	typeof CartItemToUpdateQuantitySchema
>;
export type TGetOrder = z.infer<typeof GetOrder>;
