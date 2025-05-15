export interface IApiResponse<T> {
  data: IApiData<T>;
  metaData: IApiMetaData;
}

export interface IApiData<T> {
  message: string;
  payload: Record<string, T>;
}
export interface IApiMetaData {
  error: string | null;
  errorCode: number;
}
