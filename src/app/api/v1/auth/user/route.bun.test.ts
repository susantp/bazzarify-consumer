import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { NextRequest } from "next/server";
import { GET } from "./route";

const upstreamResponse = {
  data: {
    data: {
      message: "success",
      payload: {
        user: {
          uuid: "7c80f48d-793c-415d-bace-2d44fb166866",
          authType: "email",
          name: "QA buyer",
          email: "qa.buyer@example.test",
          phone: null,
          phone_verified_at: null,
          email_verified_at: null,
        },
      },
    },
    metaData: { error: "", errorCode: 20000 },
  },
} as AxiosResponse<unknown>;

describe("GET /api/v1/auth/user", () => {
  afterEach(() => mock.restore());

  it("loads the authenticated backend user from its canonical /users route", async () => {
    const get = spyOn({ get: async () => upstreamResponse }, "get");
    const create = spyOn(axios, "create").mockReturnValue({
      get,
    } as unknown as AxiosInstance);

    const response = await GET(
      new NextRequest("http://localhost/api/v1/auth/user", {
        headers: { "x-api-token": "buyer-token" },
      }),
    );

    expect(response.status).toBe(200);
    expect((await response.json()).payload.user.name).toBe("QA buyer");
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.stringContaining("/api/v1/auth"),
        headers: expect.objectContaining({
          Authorization: "Bearer buyer-token",
        }),
      }),
    );
    expect(get).toHaveBeenCalledWith("/users");
  });

  it("does not call the backend without a buyer token", async () => {
    const create = spyOn(axios, "create");

    const response = await GET(
      new NextRequest("http://localhost/api/v1/auth/user"),
    );

    expect(response.status).toBe(401);
    expect(create).not.toHaveBeenCalled();
  });
});
