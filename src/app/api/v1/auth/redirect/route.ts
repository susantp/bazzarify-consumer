import { NextRequest, NextResponse } from "next/server";
import { authAxiosInstance } from "@/modules/core/utils/axios.util";

export async function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get("provider");

  const appUrl = new URL("bazzarify://login");
  if (!provider) {
    return NextResponse.redirect(appUrl);
  }
  try {
    const response = await authAxiosInstance.get(
      `/login/social?provider=${provider}`,
    );
    if (response.data?.metaData?.error) {
      throw new Error(response.data.metaData);
    }
    const { redirectUrl } = response.data.data.payload;
    return NextResponse.redirect(redirectUrl);
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to initiate login" },
      { status: 500 },
    );
  }
}
