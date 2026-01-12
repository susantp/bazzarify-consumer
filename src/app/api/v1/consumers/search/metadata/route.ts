import consumerInstance from "@/modules/core/utils/axios.util";
import {AxiosError, AxiosResponse, isAxiosError} from "axios";
import {ApiResponseSchema} from "@/modules/core/schemas/ApiResponseSchema";
import {handleError, handleParseError, handleSuccess,} from "@/modules/core/utils/jsonResponse.utils";
import {NextRequest} from "next/server";
import {formattedIssues} from "@/modules/core/utils/zod.util";
import {SearchMetadataPayloadSchema} from "@/modules/product/schemas/responsePayloads/SearchMetadataPayloadSchema";

/**
 * Search Metadata
 * @content-type application/json
 */
export async function GET(request: NextRequest) {
    const upstreamRequestPath = "/search/metadata";
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
    const parsed = ApiResponseSchema(SearchMetadataPayloadSchema).safeParse(
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
