import {z} from "zod";
import {SimplePaginatedSchema} from "@/modules/product/schemas/SimplePaginated";

export const OrderStatuses = z.array(z.string())

export const GetOrdersStatusesResponsePayload = z
    .object({
        orders: SimplePaginatedSchema(OrderStatuses).nullable(),
    })
    .strip();



export type TGetOrdersStatusesResponsePayload = z.infer<
    typeof GetOrdersStatusesResponsePayload
>;
