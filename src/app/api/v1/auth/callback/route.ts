import {NextRequest, NextResponse} from "next/server";
import {authAxiosInstance} from "@/modules/core/utils/axios.util";
import {handleError} from "@/modules/core/utils/jsonResponse.utils";
import {AxiosError} from "axios";
import {IApiMetaData} from "@/modules/core/types";

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
        const appUrl = new URL("bazzarify://oauth-native-callback");
        appUrl.searchParams.set("token", token);
        appUrl.searchParams.set("success", "true");
        return NextResponse.redirect(appUrl);
    } catch (e: unknown) {
        const errorData: IApiMetaData = {
            error: 'Cannot authenticate',
            errorCode: 500,
        }
        if (e instanceof AxiosError) {
            return handleError({...errorData, error: e.response?.data, errorCode: e.status || null});
        }
        return handleError(errorData);
    }
}
