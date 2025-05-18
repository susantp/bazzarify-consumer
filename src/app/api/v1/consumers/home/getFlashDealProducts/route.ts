import axiosInstance from "@/modules/core/utils/axios.util";
import { AxiosError } from "axios";

export async function GET() {
  try {
    const response = await axiosInstance.get("/home/getFlashDealProducts");
    if (response.data?.metaData?.error) {
      throw new AxiosError(response.data.metaData);
    }
    return Response.json({
      data: response.data.data,
    });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return Response.json({ metaData: error.message });
    }
    return Response.json(error);
  }
}
