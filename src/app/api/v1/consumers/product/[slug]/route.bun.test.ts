import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import type { AxiosResponse } from "axios";
import { NextRequest } from "next/server";
import axiosInstance from "@/modules/core/utils/axios.util";
import { GET } from "./route";

const productUuid = "7c80f48d-793c-415d-bace-2d44fb166866";
const storeUuid = "d720e3e0-6f18-4744-b988-d5b5e0e146dd";
const variantUuid = "e8080e0a-b022-46e6-8dd0-ef2c0a1bf7dd";

const product = {
  type: "retail",
  uuid: productUuid,
  store_uuid: storeUuid,
  image_base_path: productUuid,
  image_base_url: `https://api.example.test/storage/${productUuid}`,
  id: null,
  name: "Storefront product",
  sku: "STOREFRONT-01",
  slug: "storefront-product",
  base_price: 6.79,
  description: "Product description",
  highlights: "Product highlights",
  box_items: null,
  status_text: "ACTIVE",
  available_to_sell: 10,
  can_purchase: true,
  low_stock: false,
  commerce: {
    product_type: "retail",
    minimum_order_quantity: 1,
    enforce_minimum_order_quantity_on_cart: true,
    enforce_minimum_order_quantity_on_checkout: true,
    mixed_cart_mode: "compatible",
    fulfillment_mode: "inventory_shipping",
    cancellation_mode: "item_level_policy",
    refund_mode: "item_level_policy",
    can_purchase: true,
  },
  brand_uuid: null,
  status: 1,
  brand: {},
  images: [],
  specifications: { color: "blue" },
  created_at: null,
  updated_at: null,
  deleted_at: null,
};

const productDetail = {
  ...product,
  variants: [
    {
      uuid: variantUuid,
      product_uuid: productUuid,
      name: "Available option",
      sku: "STOREFRONT-OPTION-01",
      price: 6.79,
      stock: 10,
      available: true,
      available_to_sell: 10,
      image_base_path: `${productUuid}/variants/${variantUuid}`,
      image_base_url: `https://api.example.test/storage/${productUuid}/variants/${variantUuid}`,
      product,
    },
  ],
};

describe("GET /api/v1/consumers/product/[slug]", () => {
  afterEach(() => mock.restore());

  it("preserves backend available_to_sell on the nested variant", async () => {
    spyOn(axiosInstance, "get").mockResolvedValue({
      data: {
        data: {
          message: "Product fetched successfully",
          payload: {
            product: productDetail,
            currency: { code: "NPR" },
          },
        },
        metaData: { error: "", errorCode: 20000 },
      },
    } as AxiosResponse<unknown>);

    const response = await GET(
      new NextRequest(
        `http://localhost/api/v1/consumers/product/${productUuid}`,
      ),
      { params: Promise.resolve({ slug: productUuid }) },
    );

    expect(response.status).toBe(200);
    expect(
      (await response.json()).payload.product.variants[0].available_to_sell,
    ).toBe(10);
  });

  it("rejects detail variants without authoritative availability", async () => {
    const variantWithoutAvailability = Object.fromEntries(
      Object.entries(productDetail.variants[0]).filter(
        ([key]) => key !== "available_to_sell",
      ),
    );
    spyOn(axiosInstance, "get").mockResolvedValue({
      data: {
        data: {
          message: "Product fetched successfully",
          payload: {
            product: {
              ...product,
              variants: [{ ...variantWithoutAvailability, product }],
            },
            currency: { code: "NPR" },
          },
        },
        metaData: { error: "", errorCode: 20000 },
      },
    } as AxiosResponse<unknown>);

    const response = await GET(
      new NextRequest(
        `http://localhost/api/v1/consumers/product/${productUuid}`,
      ),
      { params: Promise.resolve({ slug: productUuid }) },
    );

    expect(response.status).toBe(502);
  });
});
