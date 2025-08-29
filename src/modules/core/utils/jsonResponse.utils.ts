import { IApiData, IApiMetaData } from "@/modules/core/types";

interface ISuccessResponse<T> {
  data: IApiData<T>;
  status: number;
}

export const handleSuccess = <T>({ data, status = 200 }: ISuccessResponse<T>) =>
  Response.json(data, { status });

export const handleError = (metaData: IApiMetaData) =>
  Response.json(metaData, { status: metaData.errorCode ?? 500 });
