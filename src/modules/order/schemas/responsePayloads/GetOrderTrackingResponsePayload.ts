import {z} from "zod";
import {OrderTrackingSchema} from "@/modules/order/schemas/TrackingSchema";

export const GetOrderTrackingResponsePayload = z
    .object({
        tracking: OrderTrackingSchema,
    })
    .strip();

export type TGetOrderTrackingResponsePayload = z.infer<typeof GetOrderTrackingResponsePayload>;
