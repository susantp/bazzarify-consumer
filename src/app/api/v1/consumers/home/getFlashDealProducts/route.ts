import consumerInstance from "@/modules/core/utils/axios.util";
import {AxiosResponse} from "axios";
import {ApiResponseSchema} from "@/modules/core/schemas/ApiResponseSchema";
import {handleError, handleParseError, handleSuccess,} from "@/modules/core/utils/jsonResponse.utils";
import {NextRequest} from "next/server";
import {z} from "zod";
import {formattedIssues} from "@/modules/core/utils/zod.util";
import {FlashDealsPayloadSchema} from "@/modules/product/schemas/responsePayloads/FlashDealsPayloadSchema";

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
        upstream = await consumerInstance.get(upstreamRequestPath, {
            params: Object.fromEntries(searchParams),
        });
    } catch (error: unknown) {
        return handleError(error)
    }
    const parsed = ApiResponseSchema(FlashDealsPayloadSchema).safeParse(
        upstream.data,
    );

    if (!parsed.success) {
        return handleParseError({
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
