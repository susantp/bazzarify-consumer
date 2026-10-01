import type { AxiosResponse } from "axios";
import { NextRequest } from "next/server";
import { z } from "zod";
import { ApiResponseSchema } from "@/modules/core/schemas/ApiResponseSchema";
import axiosInstance from "@/modules/core/utils/axios.util";
import {
  handleError,
  handleParseError,
  handleSuccess,
} from "@/modules/core/utils/jsonResponse.utils";
import { formattedIssues } from "@/modules/core/utils/zod.util";

export async function proxyStorefront<TPayload extends z.ZodType>(
  request: NextRequest,
  upstreamPath: string,
  payloadSchema: TPayload,
) {
  let upstream: AxiosResponse<unknown>;
  try {
    upstream = await axiosInstance.get(upstreamPath, {
      params: Object.fromEntries(new URL(request.url).searchParams),
    });
  } catch (error: unknown) {
    return handleError(error);
  }

  const parsed = ApiResponseSchema(payloadSchema).safeParse(upstream.data);
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

  const validatedData = data as {
    message: string;
    payload: z.infer<TPayload> | null;
  };
  return handleSuccess({ data: validatedData, status: 200 });
}
