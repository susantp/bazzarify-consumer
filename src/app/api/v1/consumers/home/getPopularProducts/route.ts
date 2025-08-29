import axiosInstance from "@/modules/core/utils/axios.util";
import { AxiosError, AxiosResponse, isAxiosError } from "axios";
import { z } from "zod";
import { NextRequest } from "next/server";
import { ApiResponseSchema } from "@/modules/core/schemas/ApiResponseSchema";
import {
  handleError,
  handleSuccess,
} from "@/modules/core/utils/jsonResponse.utils";
import { formattedIssues } from "@/modules/core/utils/zod.util";
import { PopularProductsPayloadSchema } from "@/modules/product/schemas/responsePayloads/PopularProductsPayloadSchema";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PopularProductsQueryParams = z.object({
  perPage: z.number().optional().describe("Page number"),
  limit: z.number().optional().describe("Results per page"),
  search: z.string().optional().describe("Search phrase"),
});
/**
 * GET Popular Products
 * @content-type application/json
 * @params PopularProductsQueryParams
 * @response IApiResponseSchema
 */
export async function GET(request: NextRequest) {
  const upstreamRequestPath = "/home/getPopularProducts";
  const requestUrl = new URL(request.url);
  const searchParams = requestUrl.searchParams;
  let upstream: AxiosResponse<unknown>;
  try {
    upstream = await axiosInstance.get(upstreamRequestPath, {
      params: Object.fromEntries(searchParams),
    });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const ax = error as AxiosError;
      return handleError({ error: ax.message, errorCode: 500 });
    }

    const msg = error instanceof Error ? error.message : "Unknown error";
    return handleError({ error: msg, errorCode: 500 });
  }

  const parsed = ApiResponseSchema(PopularProductsPayloadSchema).safeParse(
    upstream.data,
  );

  if (!parsed.success) {
    return handleError({
      error: formattedIssues(parsed.error.issues),
      errorCode: 502,
    });
  }

  const { data, metaData } = parsed.data;
  if (metaData?.error !== "") {
    return handleError(metaData);
  }
  return handleSuccess({
    data,
    status: 200,
  });
}
