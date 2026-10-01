import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import type { AxiosResponse } from "axios";
import { NextRequest } from "next/server";
import axiosInstance from "@/modules/core/utils/axios.util";
import { ProductSchema } from "@/modules/product/schemas/ProductSchema";
import { GET as getStore } from "./[storeUuid]/store/route";
import { GET as getCategories } from "./[storeUuid]/categories/route";
import { GET as getProducts } from "./[storeUuid]/products/route";
import { GET as getTopProducts } from "./[storeUuid]/topProducts/route";

const storeUuid = "7c80f48d-793c-415d-bace-2d44fb166866";
const page = {
  current_page: 1,
  current_page_url: "https://api.test/page?page=1",
  data: [],
  first_page_url: "https://api.test/page?page=1",
  from: null,
  next_page_url: null,
  path: "https://api.test/page",
  per_page: 10,
  prev_page_url: null,
  to: null,
};

const payloads = {
  store: {
    store: { uuid: storeUuid, name: "Store", slug: "store" },
    currency: { code: "NPR" },
  },
  categories: { homeCategories: page },
  products: { products: page, currency: { code: "NPR" } },
  topProducts: { products: page, currency: { code: "NPR" } },
};

const handlers = [
  ["store", getStore, "/store"],
  ["categories", getCategories, "/categories"],
  ["products", getProducts, "/products"],
  ["topProducts", getTopProducts, "/topProducts"],
] as const;

describe("storefront Consumer BFF routes", () => {
  afterEach(() => mock.restore());

  it.each(handlers)(
    "proxies and validates the %s response",
    async (key, handler, suffix) => {
      const get = spyOn(axiosInstance, "get").mockResolvedValue({
        data: {
          data: { message: "success", payload: payloads[key] },
          metaData: { error: "", errorCode: 20000 },
        },
      } as AxiosResponse<unknown>);

      const response = await handler(
        new NextRequest(
          `http://localhost/stores/${storeUuid}${suffix}?perPage=9`,
        ),
        { params: Promise.resolve({ storeUuid }) },
      );

      expect(response.status).toBe(200);
      expect((await response.json()).payload).toEqual(payloads[key]);
      expect(get).toHaveBeenCalledWith(`/stores/${storeUuid}${suffix}`, {
        params: { perPage: "9" },
      });
    },
  );

  it("rejects a product payload that does not match the backend contract", async () => {
    spyOn(axiosInstance, "get").mockResolvedValue({
      data: {
        data: { message: "success", payload: { products: { data: [null] } } },
        metaData: { error: "", errorCode: 20000 },
      },
    } as AxiosResponse<unknown>);

    const response = await getProducts(
      new NextRequest(`http://localhost/stores/${storeUuid}/products`),
      { params: Promise.resolve({ storeUuid }) },
    );

    expect(response.status).toBe(502);
  });

  it("uses store identity on product detail payloads instead of creator identity", () => {
    expect(ProductSchema.shape.store_uuid.parse(storeUuid)).toBe(storeUuid);
    expect("user_uuid" in ProductSchema.shape).toBeFalse();
  });
});
