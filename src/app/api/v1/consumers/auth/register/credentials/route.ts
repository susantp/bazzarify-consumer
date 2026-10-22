import { authAxiosInstance } from "@/modules/core/utils/axios.util";
import {
  createConsumerProxyFailureResponse,
  createConsumerProxySuccessResponse,
  normalizeConsumerProxyError,
} from "@/modules/core/utils/jsonResponse.utils";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body) {
    return createConsumerProxyFailureResponse({
      error: "No data provided",
      errorCode: 400,
    });
  }
  try {
    const response = await authAxiosInstance.post(
      "/register/credentials",
      body,
    );
    if (response.data?.metaData?.error) {
      return createConsumerProxyFailureResponse(
        normalizeConsumerProxyError(response.data.metaData),
      );
    }
    return createConsumerProxySuccessResponse({
      data: {
        message: "success",
        payload: response.data.data.payload,
      },
      status: 200,
    });
  } catch (error: unknown) {
    return createConsumerProxyFailureResponse(
      normalizeConsumerProxyError(error),
    );
  }
}
