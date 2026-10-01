import { describe, expect, it } from "bun:test";
import { CartResponsePayload } from "./CartResponsePayload";
import { ApiResponseSchema } from "@/modules/core/schemas/ApiResponseSchema";

describe("CartResponsePayload", () => {
  it("preserves the backend COD fee through the API envelope", () => {
    const result = ApiResponseSchema(CartResponsePayload).parse({
      data: {
        message: "success",
        payload: {
          cart: {
            items: [],
            totals: {
              sub_total: 6.79,
              discount_total: 0,
              tax_total: 0,
              shipping_total: 0,
              grand_total: 6.79,
              payment_fee: 10,
              items_count: 0,
              items_quantity: 0,
            },
          },
        },
      },
      metaData: { error: "", errorCode: 20000 },
    });

    expect(result.data.payload?.cart?.totals.payment_fee).toBe(10);
  });
});
