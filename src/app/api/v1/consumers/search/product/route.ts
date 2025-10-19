import axiosInstance from "@/modules/core/utils/axios.util";
import {AxiosError, AxiosResponse, isAxiosError} from "axios";
import {ApiResponseSchema} from "@/modules/core/schemas/ApiResponseSchema";
import {handleError, handleSuccess,} from "@/modules/core/utils/jsonResponse.utils";
import {NextRequest} from "next/server";
import {formattedIssues} from "@/modules/core/utils/zod.util";
import {ProductSearchPayloadSchema} from "@/modules/product/schemas/responsePayloads/ProductSearchPayloadSchema";

/**
 * Search Products
 * @content-type application/json
 */
export async function GET(request: NextRequest) {
    const upstreamRequestPath = "/search/product";
    const requestUrl = new URL(request.url);
    const searchParams = requestUrl.searchParams;
    let upstream: AxiosResponse<unknown>;
    try {
        upstream = await axiosInstance.get(upstreamRequestPath, {
            params: Object.fromEntries(searchParams),
        });
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            const ax = error as AxiosError;
            return handleError({error: ax.message, errorCode: error.status || 500});
        }

        const msg = error instanceof Error ? error.message : "Unknown error";
        return handleError({error: msg, errorCode: 500});
    }
    const parsed = ApiResponseSchema(ProductSearchPayloadSchema).safeParse(
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
    console.log('search response: ', parsed.data.data.payload, parsed.data.data.payload?.products?.data?.at(0));
    return handleSuccess({
        data,
        status: 200,
    });
}
