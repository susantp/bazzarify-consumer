import { IApiData, IApiMetaData, IApiResponse } from "@/modules/core/types";

export function setResponse<T>({ data, metaData }: IApiResponse<T>) {
	return {
		data: data,
		metaData: metaData,
	};
}

export function setDataResponse<T>(data: IApiData<T>) {
	return setResponse({ data, metaData: { error: null, errorCode: 200 } });
}

export function setMetaDataResponse(metaData: IApiMetaData) {
	return setResponse({ data: { message: "", payload: {} }, metaData });
}
