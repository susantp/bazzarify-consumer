import {NextRequest, NextResponse} from "next/server";
import {authAxiosInstance} from "@/modules/core/utils/axios.util";
import {handleError} from "@/modules/core/utils/jsonResponse.utils";

export async function GET(request: NextRequest) {
    const search = request.nextUrl.search;
    try {
        const response = await authAxiosInstance.get(`/login/callback${search}`);
        if (response.data?.metaData?.error) {
            return handleError({
                error: response.data.metaData.error,
                errorCode: response.data.metaData.errorCode ?? 500
            });
        }
        const {token} = response.data.data.payload;
        const appUrl = new URL("bazzarify://guest/login");
        appUrl.searchParams.set("token", token);
        appUrl.searchParams.set("success", "true");
        return NextResponse.redirect(appUrl);
    } catch (error: unknown) {
        console.log(error);
        return NextResponse.json({error: error});
    }
}
