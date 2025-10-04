import {NextRequest} from "next/server";
import {handleError, handleSuccess} from "@/modules/core/utils/jsonResponse.utils";
import {AxiosError, AxiosResponse, isAxiosError} from "axios";
import {createConsumerAxiosInstance} from "@/modules/core/utils/axios.util";
import {ApiResponseSchema} from "@/modules/core/schemas/ApiResponseSchema";
import {formattedIssues} from "@/modules/core/utils/zod.util";
import {UserAddressesPayloadSchema} from "@/modules/user/schemas/responsePayloads/UserAddressesPayloadSchema";

/**
 * List user addresses
 * @content-type application/json
 * @accept application/json
 */
export async function GET(request: NextRequest) {
    const token: string | null = request.headers.get("x-api-token");
    if (!token) {
        return handleError({
            error: "Unauthorized",
            errorCode: 401
        })
    }
    const upstreamRequestPath = `addresses`;
    let upstream: AxiosResponse<unknown>;
    try {
        const instance = createConsumerAxiosInstance(token)
        upstream = await instance.get(upstreamRequestPath);
        console.log("list addresses: ", JSON.stringify(upstream.data));
    } catch (error: unknown) {
        console.log('list addresses error: ', error);
        if (isAxiosError(error)) {
            const ax = error as AxiosError;
            return handleError({error: ax.message, errorCode: error.status || 500});
        }

        const msg = error instanceof Error ? error.message : "Unknown error";
        return handleError({error: msg, errorCode: 500});
    }
    const parsed = ApiResponseSchema(UserAddressesPayloadSchema).safeParse(
        upstream.data,
    );
    if (!parsed.success) {
        console.log("cart response parsed error: ", formattedIssues(parsed.error.issues))
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

/**
 * Save user addresses
 * @content-type application/json
 * @accept application/json
 */
export async function POST(request: NextRequest) {
    const token: string | null = request.headers.get("x-api-token");
    if (!token) {
        return handleError({
            error: "Unauthorized",
            errorCode: 401
        })
    }
    const upstreamRequestPath = `addresses`;
    const payload = await request.json()
    console.log('address payload: ', payload);
    let upstream: AxiosResponse<unknown>;
    try {
        const instance = createConsumerAxiosInstance(token)
        upstream = await instance.post(upstreamRequestPath, payload);
    } catch (error: unknown) {
        console.log('address item post error: ', error);
        if (isAxiosError(error)) {
            const ax = error as AxiosError;
            return handleError({error: ax.message, errorCode: error.status || 500});
        }

        const msg = error instanceof Error ? error.message : "Unknown error";
        return handleError({error: msg, errorCode: 500});
    }
    const parsed = ApiResponseSchema(UserAddressesPayloadSchema).safeParse(
        upstream.data,
    );
    if (!parsed.success) {
        console.log("address response parsed error: ", formattedIssues(parsed.error.issues))
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