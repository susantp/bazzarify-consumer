import { z } from "zod";
import { GetOrder } from "@/modules/order/schemas/orderSchema";
import { SimplePaginatedSchema } from "@/modules/product/schemas/SimplePaginated";

export const GetOrdersResponsePayload = z
	.object({
		orders: SimplePaginatedSchema(GetOrder).nullable(),
	})
	.strip();

export type TGetOrdersResponsePayload = z.infer<
	typeof GetOrdersResponsePayload
>;
