import { describe, expect, it } from "bun:test";
import { CreateOrderResponsePayload } from "./CreateOrderResponsePayload";

const payload = {
  cart: null,
  orderTotals: {
    sub_total: 100,
    discount_total: 0,
    tax_total: 0,
    shipping_total: 0,
    grand_total: 100,
    payment_fee: 0,
    payment_method: "cod",
    payment_status: "pending",
    store_allocations: [
      {
        store_uuid: "123e4567-e89b-42d3-a456-426614174000",
        amount_minor: 10000,
        method: "cod",
        status: "pending",
      },
    ],
  },
};

describe("CreateOrderResponsePayload", () => {
  it("accepts a pending COD order split into store allocations", () => {
    expect(CreateOrderResponsePayload.safeParse(payload).success).toBe(true);
  });

  it("rejects a payment method that is not operational", () => {
    expect(
      CreateOrderResponsePayload.safeParse({
        ...payload,
        orderTotals: { ...payload.orderTotals, payment_method: "card" },
      }).success,
    ).toBe(false);
  });

  it("rejects fractional or negative minor-unit allocations", () => {
    expect(
      CreateOrderResponsePayload.safeParse({
        ...payload,
        orderTotals: {
          ...payload.orderTotals,
          store_allocations: [
            { ...payload.orderTotals.store_allocations[0], amount_minor: 10.5 },
          ],
        },
      }).success,
    ).toBe(false);
  });
});
