import {z} from "zod";
import {SimplePaginatedSchema} from "@/modules/product/schemas/SimplePaginated";

export const OrderStatusSchema = z
    .object({
        uuid: z.uuid(),
        code: z.string(),
        label: z.string(),
    })
    .strip();

export const OrderStatuses = z.array(OrderStatusSchema);

export const GetOrdersStatusesResponsePayload = z
    .object({
        orders: SimplePaginatedSchema(OrderStatuses).nullable(),
    })
    .strip();



export type TGetOrdersStatusesResponsePayload = z.infer<
    typeof GetOrdersStatusesResponsePayload
>;
