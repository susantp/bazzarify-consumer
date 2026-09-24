import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import type { AxiosResponse } from "axios";
import { NextRequest } from "next/server";
import axiosInstance from "@/modules/core/utils/axios.util";
import { GET } from "./route";

const rootCategory = {
  uuid: "763fb23e-c46e-4f78-b579-88cb7cc43582",
  name: "Mens Fashion",
  slug: "mens-fashion",
  image_base_path: "",
  image_base_url: "",
  icon_base_path: "",
  icon_base_url: "",
  parent: null,
  products: [],
  images: [],
};

describe("GET /api/v1/consumers/categories/[slug]", () => {
  afterEach(() => mock.restore());

  it("accepts a root category whose parent is null", async () => {
    const get = spyOn(axiosInstance, "get").mockResolvedValue({
      data: {
        data: { message: "success", payload: { category: rootCategory } },
        metaData: { error: "", executionTime: 0, errorCode: 20000 },
      },
    } as AxiosResponse<unknown>);

    const response = await GET(
      new NextRequest(
        "http://localhost/api/v1/consumers/categories/mens-fashion",
      ),
      { params: Promise.resolve({ slug: "mens-fashion" }) },
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: "success",
      payload: { category: rootCategory },
    });
    expect(get).toHaveBeenCalledWith("/category/mens-fashion");
  });
});
