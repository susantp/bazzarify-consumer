import { AxiosResponse } from "axios";
import { ApiResponseSchema } from "@/modules/core/schemas/ApiResponseSchema";
import { createConsumerAxiosInstance } from "@/modules/core/utils/axios.util";
import {
	handleError,
	handleParseError,
	handleSuccess,
} from "@/modules/core/utils/jsonResponse.utils";
import { formattedIssues } from "@/modules/core/utils/zod.util";
import { GetOrderTrackingResponsePayload } from "@/modules/order/schemas/responsePayloads/GetOrderTrackingResponsePayload";
import { GetOrdersResponsePayload } from "@/modules/order/schemas/responsePayloads/GetOrdersResponsePayload";
import { NextRequest } from "next/server";

interface IGetParams {
	params: Promise<{ order: string }>;
}

export const parseTrackingUpstreamResponse = (upstreamData: unknown) =>
	ApiResponseSchema(GetOrderTrackingResponsePayload).safeParse(upstreamData);

const uuidPattern =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuid = (value: string) => uuidPattern.test(value);

const decodeParam = (value: string) => {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
};

const resolveOrderUuidFromOrderNumber = async (
	token: string,
	orderNumber: string,
) => {
	const instance = createConsumerAxiosInstance(token);
	const targetOrderNumber = orderNumber.trim();
	const maxPages = 20;

	for (let page = 1; page <= maxPages; page += 1) {
		let upstreamOrders: AxiosResponse<unknown>;
		try {
			upstreamOrders = await instance.get("/orders", { params: { page } });
		} catch {
			return null;
		}

		const parsedOrders = ApiResponseSchema(GetOrdersResponsePayload).safeParse(
			upstreamOrders.data,
		);
		if (!parsedOrders.success) {
			return null;
		}

		const { data, metaData } = parsedOrders.data;
		if (metaData?.error !== "") {
			return null;
		}

		const paginatedOrders = data.payload?.orders;
		const orders = paginatedOrders?.data ?? [];
		const matchedOrder = orders.find(
			(order) => order.order_number === targetOrderNumber,
		);

		if (matchedOrder?.uuid) {
			return matchedOrder.uuid;
		}

		if (!paginatedOrders?.next_page_url) {
			break;
		}
	}

	return null;
};

/**
 * Track Order
 * @content-type application/json
 */
export async function GET(request: NextRequest, { params }: IGetParams) {
	const token = request.headers.get("x-api-token");
	if (!token) {
		return handleError({
			error: "Unauthorized",
			errorCode: 401,
		});
	}

	const { order } = await params;
	const resolvedParam = decodeParam(order);
	const usingLegacyOrderNumberFallback = !isUuid(resolvedParam);

	if (usingLegacyOrderNumberFallback) {
		console.warn(
			`[orders/tracking] Legacy fallback path used for non-UUID identifier: ${resolvedParam}`,
		);
	}

	const resolvedOrderUuid = isUuid(resolvedParam)
		? resolvedParam
		: await resolveOrderUuidFromOrderNumber(token, resolvedParam);

	if (!resolvedOrderUuid) {
		return handleError({
			error: "Order not found",
			errorCode: 404,
		});
	}

	const upstreamRequestPath = `/orders/${resolvedOrderUuid}/tracking`;
	let upstream: AxiosResponse<unknown>;

	try {
		const instance = createConsumerAxiosInstance(token);
		upstream = await instance.get(upstreamRequestPath);
	} catch (error: unknown) {
		return handleError(error);
	}

	const parsed = parseTrackingUpstreamResponse(upstream.data);

	if (!parsed.success) {
		return handleParseError({
			error: formattedIssues(parsed.error.issues),
			errorCode: 502,
		});
	}

	const { data, metaData } = parsed.data;
	if (metaData?.error !== "") {
		return handleError(metaData);
	}

	return handleSuccess({
		data,
		status: 200,
	});
}
