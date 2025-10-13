import axiosInstance from "@/modules/core/utils/axios.util";
import { AxiosError, AxiosResponse, isAxiosError } from "axios";
import { ApiResponseSchema } from "@/modules/core/schemas/ApiResponseSchema";
import {
  handleError,
  handleSuccess,
} from "@/modules/core/utils/jsonResponse.utils";
import { formattedIssues } from "@/modules/core/utils/zod.util";
import { NextRequest } from "next/server";
import { ShowProductPayloadSchema } from "@/modules/product/schemas/responsePayloads/ShowProductPayloadSchema";

export interface IGetParams {
  params: Promise<{ slug: string }>;
}
/**
 * Show Product
 * @content-type application/json
 * @params string slug
 */
export async function GET(_req: NextRequest, { params }: IGetParams) {
  const { slug } = await params;
  const upstreamRequestPath = `/product/${slug}`;
  let upstream: AxiosResponse<unknown>;
  try {
    upstream = await axiosInstance.get(upstreamRequestPath);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const ax = error as AxiosError;
      return handleError({ error: ax.message, errorCode: error.status || 500 });
    }

    const msg = error instanceof Error ? error.message : "Unknown error";
    return handleError({ error: msg, errorCode: 500 });
  }

  const parsed = ApiResponseSchema(ShowProductPayloadSchema).safeParse(
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
