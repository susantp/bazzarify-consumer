import {NextRequest, NextResponse} from "next/server";
import {authAxiosInstance} from "@/modules/core/utils/axios.util";
import {handleError} from "@/modules/core/utils/jsonResponse.utils";

/**
 * Social login redirect
 * @content-type application/json
 * @params NextRequest
 * @response 307
 */
export async function GET(request: NextRequest) {
    const provider = request.nextUrl.searchParams.get("provider");

    const appUrl = new URL("bazzarify://guest/login");
    if (!provider) {
        return NextResponse.redirect(appUrl);
    }
    try {
        const response = await authAxiosInstance.get(
            `/login/social?provider=${provider}`,
        );
        if (response.data?.metaData?.error) {
            return handleError({error: response.data.metaData, errorCode: 500});
        }
        const {redirectUrl} = response.data.data.payload;
        return NextResponse.redirect(redirectUrl);
    } catch (error: unknown) {
        return handleError(error)
    }
}
