import axiosInstance from "@/modules/core/utils/axios.util";
import { AxiosError, isAxiosError } from "axios";
import { ApiResponseSchema } from "@/modules/core/schemas/ApiResponseSchema";
import { FlashDealsPayloadSchema } from "@/modules/product/schemas/responsePayloads/FlashDealsPayloadSchema";
import {
  handleError,
  handleSuccess,
} from "@/modules/core/utils/jsonResponse.utils";

const FlashDealsApiResponse = ApiResponseSchema(FlashDealsPayloadSchema);
export async function GET() {
  try {
    const upstream = await axiosInstance.get("/home/getFlashDealProducts");
    const parsed = FlashDealsApiResponse.safeParse(upstream.data);

    if (!parsed.success) {
      const formattedIssues = parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      }));
      return handleError({ error: formattedIssues, errorCode: 502 });
    }

    const { data, metaData } = parsed.data;
    if (metaData?.error !== "") {
      throw new AxiosError(
        metaData?.error.toString() ?? "Unknown error",
        String(metaData?.errorCode ?? "500"),
      );
    }
    return handleSuccess({ data: { message: "", payload: data }, status: 200 });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const ax = error as AxiosError;
      return handleError({ error: ax.message, errorCode: 500 });
    }

    const msg = error instanceof Error ? error.message : "Unknown error";
    return handleError({ error: msg, errorCode: 500 });
  }
}
