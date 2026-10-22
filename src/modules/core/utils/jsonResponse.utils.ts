import {
  ConsumerProxyFailure,
  ConsumerProxySuccess,
  IApiMetaData,
} from "@/modules/core/types";
import { isAxiosError } from "axios";

interface ConsumerProxySuccessResponseInput<T> {
  data: ConsumerProxySuccess<T>;
  status?: number;
}

const HTTP_STATUS_MIN = 100;
const HTTP_STATUS_MAX = 599;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const asHttpStatus = (value: unknown): number | null => {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < HTTP_STATUS_MIN ||
    value > HTTP_STATUS_MAX
  ) {
    return null;
  }
  return value;
};

const isApiMetaData = (value: unknown): value is IApiMetaData =>
  isRecord(value) &&
  "error" in value &&
  "errorCode" in value &&
  (value.errorCode === null || typeof value.errorCode === "number");

const isConsumerProxyFailure = (
  value: unknown,
): value is ConsumerProxyFailure =>
  isRecord(value) && "error" in value && asHttpStatus(value.errorCode) !== null;

export const createConsumerProxySuccessResponse = <T>({
  data,
  status = 200,
}: ConsumerProxySuccessResponseInput<T>) => Response.json(data, { status });

export const createConsumerProxyFailureResponse = (
  failure: ConsumerProxyFailure,
) => {
  const status = asHttpStatus(failure.errorCode) ?? 500;
  return Response.json(
    {
      error: failure.error,
      errorCode: status,
    } satisfies ConsumerProxyFailure,
    { status },
  );
};

export const normalizeConsumerProxyError = (
  error: unknown,
): ConsumerProxyFailure => {
  if (isAxiosError(error)) {
    const responseData: unknown = error.response?.data;
    const responseStatus = asHttpStatus(error.response?.status);

    if (isRecord(responseData) && isApiMetaData(responseData.metaData)) {
      return {
        error: responseData.metaData.error,
        errorCode:
          responseStatus ??
          asHttpStatus(responseData.metaData.errorCode) ??
          500,
      };
    }

    if (isConsumerProxyFailure(responseData)) {
      return {
        error: responseData.error,
        errorCode: responseStatus ?? responseData.errorCode,
      };
    }

    return {
      error: error.message || "Unknown error",
      errorCode: responseStatus ?? 500,
    };
  }

  if (isConsumerProxyFailure(error)) {
    return {
      error: error.error,
      errorCode: error.errorCode,
    };
  }

  if (isApiMetaData(error)) {
    return {
      error: error.error,
      errorCode: asHttpStatus(error.errorCode) ?? 500,
    };
  }

  return {
    error: error instanceof Error ? error.message : "Unknown error",
    errorCode: 500,
  };
};

/**
 * Compatibility wrappers for routes that have not yet migrated their imports.
 * They intentionally delegate to the project-scoped Consumer Proxy contract.
 */
export const handleSuccess = createConsumerProxySuccessResponse;

export const handleError = (error: unknown) =>
  createConsumerProxyFailureResponse(normalizeConsumerProxyError(error));

export const handleParseError = (metaData: IApiMetaData) =>
  createConsumerProxyFailureResponse({
    error: metaData.error,
    errorCode: asHttpStatus(metaData.errorCode) ?? 500,
  });
