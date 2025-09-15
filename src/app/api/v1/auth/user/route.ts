import {NextRequest} from "next/server";
import {createAuthAxiosInstance} from "@/modules/core/utils/axios.util";
import {handleError, handleSuccess,} from "@/modules/core/utils/jsonResponse.utils";
import {AxiosError, AxiosResponse, isAxiosError} from "axios";
import {ApiResponseSchema} from "@/modules/core/schemas/ApiResponseSchema";
import {UserPayloadSchema} from "@/modules/auth/schemas/responsePayloads/UserPayloadSchema";
import {formattedIssues} from "@/modules/core/utils/zod.util";

/**
 * Get Authenticated User
 * @content-type application/json
 * @params NextRequest
 * @response 200
 */
export async function GET(request: NextRequest) {
    const token = request.headers.get("x-api-token");
    if (!token) {
        return handleError({
            error: "Unauthorized",
            errorCode: 401
        })
    }
    const upstreamRequestPath = "/user";
    let upstream: AxiosResponse<unknown>;
    try {
        const instance = createAuthAxiosInstance(token)
        upstream = await instance.get(upstreamRequestPath);
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            const ax = error as AxiosError;
            return handleError({error: ax.message, errorCode: error.status || 500});
        }

        const msg = error instanceof Error ? error.message : "Unknown error";
        return handleError({error: msg, errorCode: 500});
    }
    const parsed = ApiResponseSchema(UserPayloadSchema).safeParse(
        upstream.data,
    );

    if (!parsed.success) {
        return handleError({
            error: formattedIssues(parsed.error.issues),
            errorCode: 502,
        });
    }

    const {data, metaData} = parsed.data;
    if (metaData?.error !== "") {
        return handleError(metaData);
    }
    return handleSuccess({
        data,
        status: 200,
    });
}