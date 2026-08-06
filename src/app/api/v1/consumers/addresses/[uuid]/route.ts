import { NextRequest } from "next/server";
import {
	handleError,
	handleParseError,
	handleSuccess,
} from "@/modules/core/utils/jsonResponse.utils";
import { AxiosResponse } from "axios";
import { createConsumerAxiosInstance } from "@/modules/core/utils/axios.util";
import { ApiResponseSchema } from "@/modules/core/schemas/ApiResponseSchema";
import { UserAddressesPayloadSchema } from "@/modules/user/schemas/responsePayloads/UserAddressesPayloadSchema";
import { formattedIssues } from "@/modules/core/utils/zod.util";
import { TUserAddressUuid } from "@/modules/user/schemas/UserSchema";

/**
 * Update user addresses
 * @content-type application/json
 * @accept application/json
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<TUserAddressUuid> },
) {
	const token: string | null = request.headers.get("x-api-token");
	if (!token) {
		return handleError({
			error: "Unauthorized",
			errorCode: 401,
		});
	}
	const { uuid } = await params;
	const upstreamRequestPath = `addresses/${uuid}`;
	const payload = await request.json();
	console.log("address payload: ", payload);
	let upstream: AxiosResponse<unknown>;
	try {
		const instance = createConsumerAxiosInstance(token);
		upstream = await instance.patch(upstreamRequestPath, payload);
	} catch (error: unknown) {
		return handleError(error);
	}
	const parsed = ApiResponseSchema(UserAddressesPayloadSchema).safeParse(
		upstream.data,
	);
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
