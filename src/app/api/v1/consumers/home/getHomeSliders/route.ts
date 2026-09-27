import type { AxiosResponse } from "axios";
import { NextRequest } from "next/server";
import { ApiResponseSchema } from "@/modules/core/schemas/ApiResponseSchema";
import axiosInstance from "@/modules/core/utils/axios.util";
import {
  handleError,
  handleParseError,
  handleSuccess,
} from "@/modules/core/utils/jsonResponse.utils";
import { formattedIssues } from "@/modules/core/utils/zod.util";
import { HomeSlidersPayloadSchema } from "@/modules/marketing/schemas/HomeSlidersPayloadSchema";

export async function GET(request: NextRequest) {
  const configuredBaseURL = axiosInstance.defaults.baseURL;
  const backendBaseURL = configuredBaseURL?.replace(/\/consumers\/?$/, "");

  if (!backendBaseURL) {
    return handleError(new Error("Backend API base URL is not configured"));
  }

  let upstream: AxiosResponse<unknown>;
  try {
    upstream = await axiosInstance.get("/marketing/sliders", {
      baseURL: backendBaseURL,
      params: Object.fromEntries(new URL(request.url).searchParams),
    });
  } catch (error: unknown) {
    return handleError(error);
  }

  const parsed = ApiResponseSchema(HomeSlidersPayloadSchema).safeParse(
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
