import axiosInstance from "@/modules/core/utils/axios.util";
import {AxiosError, AxiosResponse, isAxiosError} from "axios";
import {ApiResponseSchema} from "@/modules/core/schemas/ApiResponseSchema";
import {FlashDealsPayloadSchema} from "@/modules/product/schemas/responsePayloads/FlashDealsPayloadSchema";
import {handleError, handleSuccess,} from "@/modules/core/utils/jsonResponse.utils";
import {NextRequest} from "next/server";
import {z} from "zod";
import {formattedIssues} from "@/modules/core/utils/zod.util";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FlashDealQueryParams = z.object({
    perPage: z.number().optional().describe("Page number"),
    limit: z.number().optional().describe("Results per page"),
    search: z.string().optional().describe("Search phrase"),
});

/**
 * GET Flash Deals Products
 * @content-type application/json
 * @params FlashDealQueryParams
 * @response IApiResponseSchema
 */
export async function GET(request: NextRequest) {
    const upstreamRequestPath = "/home/getFlashDealProducts";
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
            return handleError({error: ax.message, errorCode: 500});
        }

        const msg = error instanceof Error ? error.message : "Unknown error";
        return handleError({error: msg, errorCode: 500});
    }
    const parsed = ApiResponseSchema(FlashDealsPayloadSchema).safeParse(
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
