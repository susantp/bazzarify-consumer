import consumerInstance from "@/modules/core/utils/axios.util";
import { AxiosResponse } from "axios";
import { ApiResponseSchema } from "@/modules/core/schemas/ApiResponseSchema";
import {
	handleError,
	handleParseError,
	handleSuccess,
} from "@/modules/core/utils/jsonResponse.utils";
import { formattedIssues } from "@/modules/core/utils/zod.util";
import { NextRequest } from "next/server";
import { ShowCategoryPayloadSchema } from "@/modules/product/schemas/responsePayloads/ShowCategorytPayloadSchema";

export interface IGetParams {
	params: Promise<{ slug: string }>;
}

/**
 * Show Category
 * @content-type application/json
 * @params string slug
 */
export async function GET(_req: NextRequest, { params }: IGetParams) {
	const { slug } = await params;
	const upstreamRequestPath = `/category/${slug}`;
	let upstream: AxiosResponse<unknown>;
	try {
		upstream = await consumerInstance.get(upstreamRequestPath);
	} catch (error: unknown) {
		return handleError(error);
	}
	const parsed = ApiResponseSchema(ShowCategoryPayloadSchema).safeParse(
		upstream.data,
	);
	if (!parsed.success) {
		console.log("parsing error: ", parsed.error.issues);
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
