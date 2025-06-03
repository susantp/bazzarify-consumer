import { NextRequest, NextResponse } from "next/server";
import { authAxiosInstance } from "@/modules/core/utils/axios.util";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.search;
  try {
    const response = await authAxiosInstance.get(`/login/callback${search}`);
    if (response.data?.metaData?.error) {
      throw new Error(response.data.metaData.error);
    }
    const { token } = response.data.data.payload;
    const appUrl = new URL("bazzarify://login");
    appUrl.searchParams.set("token", token);
    appUrl.searchParams.set("success", "true");
    return NextResponse.redirect(appUrl);
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json({ error: error });
  }
}
