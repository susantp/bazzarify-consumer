import type { AxiosResponse } from "axios";
import { ApiResponseSchema } from "@/modules/core/schemas/ApiResponseSchema";
import { createConsumerAxiosInstance } from "@/modules/core/utils/axios.util";
import { formattedIssues } from "@/modules/core/utils/zod.util";
import { GetOrdersResponsePayload } from "@/modules/order/schemas/responsePayloads/GetOrdersResponsePayload";
import {
	handleError,
	handleParseError,
	handleSuccess,
} from "@/modules/core/utils/jsonResponse.utils";
import type { NextRequest } from "next/server";

/**
 * Get Order
 * @content-type application/json
 * @params string slug
 */
export async function GET(request: NextRequest) {
	const token = request.headers.get("x-api-token");
	if (!token) {
		return handleError({
			error: "Unauthorized",
			errorCode: 401,
		});
	}
	const upstreamRequestPath = "/orders";
	let upstream: AxiosResponse<unknown>;
	try {
		const instance = createConsumerAxiosInstance(token);
		upstream = await instance.get(upstreamRequestPath);
	} catch (error: unknown) {
		return handleError(error);
	}
	const parsed = ApiResponseSchema(GetOrdersResponsePayload).safeParse(
		upstream.data,
	);
	if (!parsed.success) {
		return handleParseError({
			error: formattedIssues(parsed.error.issues),
			errorCode: 502,
		});
	}

	const { data, metaData } = parsed.data;
	console.log("orders: ", data, metaData);
	if (metaData?.error !== "") {
		return handleError(metaData);
	}
	return handleSuccess({
		data,
		status: 200,
	});
}
