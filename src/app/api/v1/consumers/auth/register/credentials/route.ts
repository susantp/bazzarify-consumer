import {
	setDataResponse,
	setMetaDataResponse,
} from "@/modules/core/data/apiResponse";
import { authAxiosInstance } from "@/modules/core/utils/axios.util";
import { handleError } from "@/modules/core/utils/jsonResponse.utils";

export async function POST(request: Request) {
	const body = await request.json();
	if (!body) {
		return Response.json(
			setMetaDataResponse({ error: "No data provided", errorCode: 400 }),
			{ status: 400, statusText: "Bad Request" },
		);
	}
	try {
		const response = await authAxiosInstance.post(
			"/register/credentials",
			body,
		);
		if (response.data?.metaData?.error) {
			return Response.json(setMetaDataResponse(response.data.metaData), {
				status: response.data.metaData.errorCode || 400,
				statusText: response.data.metaData.error || "Bad Request",
			});
		}
		return Response.json(
			setDataResponse({
				message: "success",
				payload: response.data.data.payload,
			}),
		);
	} catch (error: unknown) {
		return handleError(error);
	}
}
