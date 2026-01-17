import {NextRequest} from "next/server";
import {handleError, handleParseError, handleSuccess} from "@/modules/core/utils/jsonResponse.utils";
import {AxiosResponse} from "axios";
import {createConsumerAxiosInstance} from "@/modules/core/utils/axios.util";
import {ApiResponseSchema} from "@/modules/core/schemas/ApiResponseSchema";
import {CartResponsePayload} from "@/modules/cart/schemas/responsePayloads/CartResponsePayload";
import {formattedIssues} from "@/modules/core/utils/zod.util";

export async function POST(request: NextRequest) {
    const token = request.headers.get("x-api-token");
    if (!token) {
        return handleError({
            error: "Unauthorized",
            errorCode: 401
        })
    }
    const upstreamRequestPath = "/cart/items/remove";
    const payload = await request.json()
    let upstream: AxiosResponse<unknown>;
    try {
        const instance = createConsumerAxiosInstance(token)
        upstream = await instance.post(upstreamRequestPath, payload);
        console.log("cart add response: ", JSON.stringify(upstream.data));
    } catch (error: unknown) {
        return handleError(error)
    }
    const parsed = ApiResponseSchema(CartResponsePayload).safeParse(
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