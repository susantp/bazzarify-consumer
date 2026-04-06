import type {AxiosResponse} from "axios";
import {handleError, handleParseError} from "@/modules/core/utils/jsonResponse.utils";
import {createConsumerAxiosInstance} from "@/modules/core/utils/axios.util";
import {formattedIssues} from "@/modules/core/utils/zod.util";
import {OrderStatuses} from "@/modules/order/schemas/responsePayloads/GetOrdersStatusesResponsePayload";
import type {NextRequest} from "next/server";

/**
 * Get Available Order Statuses
 * @content-type application/json
 */
export async function GET(request: NextRequest) {
    const token = request.headers.get("x-api-token");
    if (!token) {
        return handleError({
            error: "Unauthorized",
            errorCode: 401,
        })
    }

    const upstreamRequestPath = "/orders/statuses";
    let upstream: AxiosResponse<unknown>;
    try {
        const instance = createConsumerAxiosInstance(token)
        upstream = await instance.get(upstreamRequestPath);
    } catch (error: unknown) {
        return handleError(error)
    }

    const parsed = OrderStatuses.safeParse(upstream.data)
    if (!parsed.success) {
        return handleParseError({
            error: formattedIssues(parsed.error.issues),
            errorCode: 502,
        });
    }
    //TODO rollback the comment after dev finish

    // const {data, metaData} = parsed.data;
    // console.log('orders statuses: ', data, metaData);
    // if (metaData?.error !== "") {
    //     return handleError(metaData);
    // }
    // return handleSuccess({
    //     parsedData: parsed.data,
    //     status: 200,
    // });

    return Response.json(parsed.data)
}
