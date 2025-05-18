import {
  setDataResponse,
  setMetaDataResponse,
} from "@/modules/core/data/apiResponse";
import { authAxiosInstance } from "@/modules/core/utils/axios.util";
import { AxiosError } from "axios";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body) {
    return Response.json(
      setMetaDataResponse({ error: "No data provided", errorCode: 400 }),
      { status: 400, statusText: "Bad Request" },
    );
  }
  try {
    const response = await authAxiosInstance.post("/login/credentials", body);
    if (response.data?.metaData?.error) {
      return Response.json(setMetaDataResponse(response.data.metaData), {
        status: 400,
        statusText: "Bad Request",
      });
    }
    return Response.json(
      setDataResponse({
        message: "success",
        payload: response.data.data.payload,
      }),
    );
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return Response.json(
        setMetaDataResponse({
          error: error.response?.data?.metaData.error,
          errorCode: 500,
        }),
        { status: 500, statusText: "Internal Server Error" },
      );
    }
    return Response.json(
      setMetaDataResponse({ error: "Unknown error", errorCode: 500 }),
      { status: 500, statusText: "Internal Server Error" },
    );
  }
}
