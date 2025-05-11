export interface IApiResponse<T> {
  data: {
    message: string;
    payload: Record<string, T>;
  };
  metaData: {
    error: string | null;
    errorCode: number;
  };
}
