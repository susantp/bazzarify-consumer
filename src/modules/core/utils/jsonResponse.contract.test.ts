import { describe, expect, test } from "bun:test";
import {
  createConsumerProxyFailureResponse,
  createConsumerProxySuccessResponse,
  normalizeConsumerProxyError,
} from "@/modules/core/utils/jsonResponse.utils";

const readJson = async (response: Response) => response.json();

describe("Consumer Proxy response contract", () => {
  test("creates the explicit success shape", async () => {
    const response = createConsumerProxySuccessResponse({
      data: { message: "success", payload: { items: [] } },
    });

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({
      message: "success",
      payload: { items: [] },
    });
  });

  test("creates a failure response with the same HTTP status", async () => {
    const response = createConsumerProxyFailureResponse({
      error: "Unauthorized",
      errorCode: 401,
    });

    expect(response.status).toBe(401);
    expect(await readJson(response)).toEqual({
      error: "Unauthorized",
      errorCode: 401,
    });
  });

  test("normalizes missing-token failures", () => {
    expect(
      normalizeConsumerProxyError({ error: "Unauthorized", errorCode: 401 }),
    ).toEqual({ error: "Unauthorized", errorCode: 401 });
  });

  test("preserves an upstream backend HTTP status and error", () => {
    const error = {
      isAxiosError: true,
      message: "Request failed",
      response: {
        status: 422,
        data: {
          data: { message: "", payload: null },
          metaData: { error: "Validation failed", errorCode: 422 },
        },
      },
    };

    expect(normalizeConsumerProxyError(error)).toEqual({
      error: "Validation failed",
      errorCode: 422,
    });
  });

  test("maps schema failures to 502", async () => {
    const response = createConsumerProxyFailureResponse({
      error: [
        {
          path: "data.payload",
          message: "Invalid input",
          code: "invalid_type",
        },
      ],
      errorCode: 502,
    });

    expect(response.status).toBe(502);
    expect(await readJson(response)).toEqual({
      error: [
        {
          path: "data.payload",
          message: "Invalid input",
          code: "invalid_type",
        },
      ],
      errorCode: 502,
    });
  });

  test("maps unknown failures to 500", () => {
    expect(normalizeConsumerProxyError({ unexpected: true })).toEqual({
      error: "Unknown error",
      errorCode: 500,
    });
  });
});
