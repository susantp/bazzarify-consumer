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


/**
 * follow these Principles:
 * - IntelliSense-friendly patterns.
 * - Reference latest JavaScript & TypeScript docs.
 * - Always functional approach.
 * - Finest e-commerce design suggestions.
 * - React Native 19, Expo 53, TypeScript 5.
 * - Approaches:
 *   - Scalable
 *   - Readable
 *   - One-liner where appropriate
 *   - Modular
 *   - Solid but simple (avoid over-engineering)
 *   - Strongly typed (avoid `any`)
 *
 * do these:
 * ----
 * - Keep modular structure: each module owns its domain; shared stuff in `core`.
 * - Write strict TypeScript: no `any`, define clear types/interfaces.
 * - Keep hooks thin (orchestration only); put logic in `utils/services`.
 * - Use constants/config for keys & env, never hardcode strings.
 * - Handle errors in utils, report via Sentry/logging.
 * - Use mirror pattern: storage for persistence, state (atoms) for reactive access.
 * - Keep functions small, composable, and testable.
 *
 * dont do these:
 * ---
 * - Don’t create require cycles (e.g., `auth → core → auth`).
 * - Don’t put business logic inside hooks/components.
 * - Don’t block render with async work — bootstrap in effects/pipelines.
 * - Don’t duplicate utilities across modules.
 * - Don’t use library internals (e.g., `SetAtom` from Jotai) — define local types.
 * - Don’t swallow errors or logs — always capture.
 */