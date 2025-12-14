import consumerInstance from "@/modules/core/utils/axios.util";
import {AxiosResponse} from "axios";
import {ApiResponseSchema} from "@/modules/core/schemas/ApiResponseSchema";
import {handleError, handleParseError, handleSuccess,} from "@/modules/core/utils/jsonResponse.utils";
import {NextRequest} from "next/server";
import {formattedIssues} from "@/modules/core/utils/zod.util";
import {HomeCategoriesPayloadSchema} from "@/modules/product/schemas/responsePayloads/HomeCategoriesPayloadSchema";

export interface IGetParams {
    params: Promise<{ uuid: string }>;
}

/**
 * Vendor Categories
 * @content-type application/json
 */
export async function GET(req: NextRequest, {params}: IGetParams) {
    const {uuid} = await params;
    const upstreamRequestPath = `/vendors/${uuid}/categories`;
    const requestUrl = new URL(req.url);
    const searchParams = requestUrl.searchParams;
    let upstream: AxiosResponse<unknown>;
    try {
        upstream = await consumerInstance.get(upstreamRequestPath, {
            params: Object.fromEntries(searchParams),
        });
    } catch (error: unknown) {
        return handleError(error)
    }
    const parsed = ApiResponseSchema(HomeCategoriesPayloadSchema).safeParse(
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