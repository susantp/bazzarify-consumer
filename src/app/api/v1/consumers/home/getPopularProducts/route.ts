import consumerInstance from "@/modules/core/utils/axios.util";
import { AxiosError, AxiosResponse, isAxiosError } from "axios";
import { z } from "zod";
import { NextRequest } from "next/server";
import { ApiResponseSchema } from "@/modules/core/schemas/ApiResponseSchema";
import {
    handleError, handleParseError,
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
    upstream = await consumerInstance.get(upstreamRequestPath, {
      params: Object.fromEntries(searchParams),
    });
  } catch (error: unknown) {
    return handleError(error)
  }

  const parsed = ApiResponseSchema(PopularProductsPayloadSchema).safeParse(
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
  return handleSuccess({
    data,
    status: 200,
  });
}
