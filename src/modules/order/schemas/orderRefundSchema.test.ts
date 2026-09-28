import { describe, expect, it } from "bun:test";
import { OrderItemRefundCaseSchema } from "./orderSchema";

const refundCase = {
  uuid: "123e4567-e89b-42d3-a456-426614174000",
  requested_quantity: 1,
  amount_minor: 1250,
  status: "returned",
  reason: "Item arrived damaged",
  created_at: "2026-09-28T12:00:00.000Z",
  decision_at: "2026-09-28T13:00:00.000Z",
  returned_at: "2026-09-28T14:00:00.000Z",
};

describe("OrderItemRefundCaseSchema", () => {
  it("accepts the buyer-visible refund status projection", () => {
    expect(OrderItemRefundCaseSchema.safeParse(refundCase).success).toBe(true);
  });

  it("strips internal decision and receipt evidence", () => {
    const parsed = OrderItemRefundCaseSchema.parse({
      ...refundCase,
      decision_note: "Internal note",
      return_receipt_reference: "cash-desk-42",
      allocation_uuid: "123e4567-e89b-42d3-a456-426614174001",
    });

    expect(parsed).not.toHaveProperty("decision_note");
    expect(parsed).not.toHaveProperty("return_receipt_reference");
    expect(parsed).not.toHaveProperty("allocation_uuid");
  });

  it("rejects unknown lifecycle values and fractional minor-unit amounts", () => {
    expect(
      OrderItemRefundCaseSchema.safeParse({ ...refundCase, status: "paid" })
        .success,
    ).toBe(false);
    expect(
      OrderItemRefundCaseSchema.safeParse({ ...refundCase, amount_minor: 1.5 })
        .success,
    ).toBe(false);
  });
});
