import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import type { AxiosResponse } from "axios";
import { NextRequest } from "next/server";
import axiosInstance from "@/modules/core/utils/axios.util";
import { GET } from "./route";

const upstreamEnvelope = {
  data: {
    message: "success",
    payload: {
      sliders: {
        current_page: 1,
        current_page_url:
          "http://local-ne.larashops.local/api/v1/marketing/sliders?page=1",
        data: [],
        first_page_url:
          "http://local-ne.larashops.local/api/v1/marketing/sliders?page=1",
        from: null,
        next_page_url: null,
        path: "http://local-ne.larashops.local/api/v1/marketing/sliders",
        per_page: "5",
        prev_page_url: null,
        to: null,
      },
      table: { filters: [] },
    },
  },
  metaData: { error: "", executionTime: 0, errorCode: 20000 },
};

describe("GET /api/v1/consumers/home/getHomeSliders", () => {
  afterEach(() => mock.restore());

  it("proxies the marketing endpoint and returns the validated mobile payload", async () => {
    const get = spyOn(axiosInstance, "get").mockResolvedValue({
      data: upstreamEnvelope,
    } as AxiosResponse<unknown>);

    const response = await GET(
      new NextRequest(
        "http://localhost/api/v1/consumers/home/getHomeSliders?perPage=5",
      ),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: "success",
      payload: { sliders: upstreamEnvelope.data.payload.sliders },
    });
    expect(get).toHaveBeenCalledWith(
      "/marketing/sliders",
      expect.objectContaining({
        baseURL: axiosInstance.defaults.baseURL?.replace(/\/consumers\/?$/, ""),
        params: { perPage: "5" },
      }),
    );
  });

  it("rejects a malformed backend slider payload", async () => {
    spyOn(axiosInstance, "get").mockResolvedValue({
      data: {
        ...upstreamEnvelope,
        data: {
          ...upstreamEnvelope.data,
          payload: {
            sliders: {
              ...upstreamEnvelope.data.payload.sliders,
              data: [null],
            },
          },
        },
      },
    } as AxiosResponse<unknown>);

    const response = await GET(
      new NextRequest("http://localhost/api/v1/consumers/home/getHomeSliders"),
    );

    expect(response.status).toBe(502);
  });
});
