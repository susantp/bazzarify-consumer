import { IApiMetaData } from "@/modules/core/data";

interface ISuccessResponse<T> {
  data: { message: string; payload: T };
  status: number;
}

export const handleSuccess = <T>({ data, status }: ISuccessResponse<T>) =>
  Response.json(data, { status });

export const handleError = (data: IApiMetaData) =>
  Response.json(data, { status: data.errorCode ?? 500 });
