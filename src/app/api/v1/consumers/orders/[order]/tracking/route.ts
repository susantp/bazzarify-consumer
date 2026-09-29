import { NextRequest } from "next/server";
import {
  handleError,
  handleParseError,
  handleSuccess,
} from "@/modules/core/utils/jsonResponse.utils";
import { AxiosResponse } from "axios";
import { createConsumerAxiosInstance } from "@/modules/core/utils/axios.util";
import { ApiResponseSchema } from "@/modules/core/schemas/ApiResponseSchema";
import { formattedIssues } from "@/modules/core/utils/zod.util";
import { GetOrderTrackingResponsePayload } from "@/modules/order/schemas/responsePayloads/GetOrderTrackingResponsePayload";

type RouteContext = { params: Promise<{ order: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  const token = request.headers.get("x-api-token");
  if (!token) {
    return handleError({ error: "Unauthorized", errorCode: 401 });
  }

  const { order } = await params;
  let upstream: AxiosResponse<unknown>;
  try {
    upstream = await createConsumerAxiosInstance(token).get(
      `/orders/${encodeURIComponent(order)}/tracking`,
    );
  } catch (error: unknown) {
    return handleError(error);
  }

  const parsed = ApiResponseSchema(GetOrderTrackingResponsePayload).safeParse(
    upstream.data,
  );
  if (!parsed.success) {
    return handleParseError({
      error: formattedIssues(parsed.error.issues),
      errorCode: 502,
    });
  }

  const { data, metaData } = parsed.data;
  if (metaData?.error !== "") {
    return handleError(metaData);
  }
  return handleSuccess({ data, status: 200 });
}
