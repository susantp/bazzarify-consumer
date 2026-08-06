import { IApiData, IApiMetaData, IApiResponse } from "@/modules/core/types";
import { AxiosError, isAxiosError } from "axios";

interface ISuccessResponse<T> {
	data: IApiData<T>;
	status: number;
}

export const handleSuccess = <T>({ data, status = 200 }: ISuccessResponse<T>) =>
	Response.json(data, { status });

export const handleError = (error: unknown) => {
	if ("error" in (error as never) && "errorCode" in (error as never)) {
		const err = error as IApiMetaData;
		return Response.json(
			{ error: err.error, errorCode: err.errorCode },
			{ status: err.errorCode ?? 500 },
		);
	}
	const metaData: IApiMetaData = {
		error: error instanceof Error ? error.message : "Unknown error",
		errorCode: 500,
	};

	if (isAxiosError(error)) {
		const ax = error as AxiosError;
		const responseData = ax.response?.data as IApiResponse<IApiMetaData>;

		if (responseData !== undefined && "metaData" in responseData) {
			metaData["error"] = responseData.metaData.error;
			metaData["errorCode"] = responseData.metaData.errorCode;
		}
		return Response.json(metaData, { status: metaData.errorCode ?? 500 });
	}
	console.log("error handled: ", error);
	return Response.json(metaData, { status: metaData.errorCode ?? 500 });
};

export const handleParseError = (metaData: IApiMetaData) => {
	console.log("handleParseError", metaData);
	return Response.json(metaData, { status: metaData.errorCode ?? 500 });
};
