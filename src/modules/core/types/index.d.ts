export interface IApiResponse<T> {
  data: IApiData<T>;
  metaData: IApiMetaData;
}

export type ConsumerProxyError = IApiMetaData["error"];

export interface ConsumerProxySuccess<T> {
  message: string;
  payload: T | null;
}

export interface ConsumerProxyFailure {
  error: ConsumerProxyError;
  errorCode: number;
}

export type ConsumerProxyResponse<T> =
  | ConsumerProxySuccess<T>
  | ConsumerProxyFailure;

export interface IApiData<T> {
  message: string;
  payload: null | Record<string, T>;
}
export interface IApiSchemaIssue {
  path: string;
  message: string;
  code: string;
}
export interface IApiMetaData {
  error: string | null | Record<string, unknown> | IApiSchemaIssue[];
  executionTime?: number | null;
  errorCode: number | null;
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
