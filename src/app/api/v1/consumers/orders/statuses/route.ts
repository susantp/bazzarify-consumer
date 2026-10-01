import { AxiosResponse } from "axios";
import { NextRequest } from "next/server";
import { z } from "zod";
import axiosInstance from "@/modules/core/utils/axios.util";
import {
  handleError,
  handleParseError,
  handleSuccess,
} from "@/modules/core/utils/jsonResponse.utils";
import { formattedIssues } from "@/modules/core/utils/zod.util";

const CustomerOrderStatusGroupsSchema = z.array(
  z
    .object({
      code: z.string(),
      label: z.string(),
      statuses: z.array(z.string()).optional(),
    })
    .strip(),
);

export async function GET(request: NextRequest) {
  const token = request.headers.get("x-api-token");
  if (!token) {
    return handleError({ error: "Unauthorized", errorCode: 401 });
  }

  let upstream: AxiosResponse<unknown>;
  try {
    upstream = await axiosInstance.get("/orders/statuses", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: unknown) {
    return handleError(error);
  }

  const parsed = CustomerOrderStatusGroupsSchema.safeParse(upstream.data);
  if (!parsed.success) {
    return handleParseError({
      error: formattedIssues(parsed.error.issues),
      errorCode: 502,
    });
  }

  return handleSuccess({
    data: { message: "Order Statuses", payload: parsed.data },
    status: 200,
  });
}
