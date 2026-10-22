import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import type { AxiosResponse } from "axios";
import { NextRequest } from "next/server";
import axiosInstance from "@/modules/core/utils/axios.util";
import { GET } from "./route";

const upstreamGroups = [
  { code: "all", label: "All" },
  {
    code: "to_ship",
    label: "To Ship",
    statuses: ["draft", "confirmed", "allocated"],
  },
  {
    code: "to_receive",
    label: "To Receive",
    statuses: ["partially_shipped", "shipped", "delivered"],
  },
  { code: "completed", label: "Completed", statuses: ["completed"] },
  { code: "returns", label: "Returns", statuses: ["canceled", "returned"] },
];

describe("GET /api/v1/consumers/orders/statuses", () => {
  afterEach(() => mock.restore());

  it("proxies backend lifecycle statuses into the buyer filter contract", async () => {
    const get = spyOn(axiosInstance, "get").mockResolvedValue({
      data: upstreamGroups,
    } as AxiosResponse<unknown>);

    const response = await GET(
      new NextRequest("http://localhost/api/v1/consumers/orders/statuses", {
        headers: { "x-api-token": "buyer-token" },
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: "Order Statuses",
      payload: upstreamGroups,
    });
    expect(get).toHaveBeenCalledWith("/orders/statuses", {
      headers: { Authorization: "Bearer buyer-token" },
    });
  });

  it("requires the native buyer token", async () => {
    const get = spyOn(axiosInstance, "get");
    const response = await GET(
      new NextRequest("http://localhost/api/v1/consumers/orders/statuses"),
    );

    expect(response.status).toBe(401);
    expect(get).not.toHaveBeenCalled();
  });

  it("rejects malformed backend status payloads", async () => {
    spyOn(axiosInstance, "get").mockResolvedValue({
      data: [{ code: "to_ship", label: 42 }],
    } as AxiosResponse<unknown>);

    const response = await GET(
      new NextRequest("http://localhost/api/v1/consumers/orders/statuses", {
        headers: { "x-api-token": "buyer-token" },
      }),
    );

    expect(response.status).toBe(502);
  });
});
