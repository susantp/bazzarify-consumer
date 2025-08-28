export interface IApiResponse<T> {
  data: IApiData<T>;
  metaData: IApiMetaData;
}

export interface IApiData<T> {
  message: string;
  payload: Record<string, T>;
}
export interface IApiMetaData {
  error: string | null | object[];
  errorCode: number;
}
export interface ISimplePaginated<T> {
  current_page: number;
  current_page_url: string;
  data: T;
  first_page_url: string;
  from: number;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: 15;
}
