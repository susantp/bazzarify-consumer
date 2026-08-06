import { NextRequest } from "next/server";
import {
	handleError,
	handleParseError,
	handleSuccess,
} from "@/modules/core/utils/jsonResponse.utils";
import consumerInstance, {
	createConsumerAxiosInstance,
} from "@/modules/core/utils/axios.util";
import { AxiosResponse } from "axios";
import { ApiResponseSchema } from "@/modules/core/schemas/ApiResponseSchema";
import { formattedIssues } from "@/modules/core/utils/zod.util";
import { SearchHistoryPayloadSchema } from "@/modules/search/schemas/SearchHistoryPayloadSchema";

function resolveHeaders(request: NextRequest) {
	const token = request.headers.get("x-api-token");
	const actorId = request.headers.get("x-actor-id");

	return {
		actorId,
		upstream:
			token !== null ? createConsumerAxiosInstance(token) : consumerInstance,
	};
}

function actorHeaderConfig(actorId: string | null) {
	return actorId ? { headers: { "X-Actor-Id": actorId } } : undefined;
}

function parseUpstream(upstream: AxiosResponse<unknown>) {
	const parsed = ApiResponseSchema(SearchHistoryPayloadSchema).safeParse(
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

export async function GET(request: NextRequest) {
	const { actorId, upstream } = resolveHeaders(request);

	try {
		const response = await upstream.get(
			"search/history",
			actorHeaderConfig(actorId),
		);
		return parseUpstream(response);
	} catch (error) {
		return handleError(error);
	}
}

export async function POST(request: NextRequest) {
	const payload = await request.json();
	const { actorId, upstream } = resolveHeaders(request);

	try {
		const response = await upstream.post(
			"search/history",
			payload,
			actorHeaderConfig(actorId),
		);
		return parseUpstream(response);
	} catch (error) {
		return handleError(error);
	}
}

export async function DELETE(request: NextRequest) {
	const { actorId, upstream } = resolveHeaders(request);
	const requestUrl = new URL(request.url);

	try {
		const response = await upstream.delete("search/history", {
			...actorHeaderConfig(actorId),
			params: Object.fromEntries(requestUrl.searchParams),
		});
		return parseUpstream(response);
	} catch (error) {
		return handleError(error);
	}
}
