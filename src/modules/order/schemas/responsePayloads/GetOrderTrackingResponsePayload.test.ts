import { describe, expect, it } from "bun:test";
import { GetOrderTrackingResponsePayload } from "./GetOrderTrackingResponsePayload";

const payload = {
  tracking: {
    order_uuid: "019bf642-c317-7253-a8fc-85d11fcb2a49",
    order_number: "ORD-TRACK-1",
    tracking_number: null,
    current_status: "partially_shipped",
    estimated_delivery_window: { from: null, to: null },
    timeline: [
      {
        uuid: "019bf642-c317-7253-a8fc-85d11fcb2a50",
        status: "partially_shipped",
        title: "Partially shipped",
        description: null,
        changed_at: "2026-09-29T12:00:00+00:00",
        is_current: true,
      },
    ],
    delivery_units: [
      {
        uuid: "019bf642-c317-7253-a8fc-85d11fcb2a51",
        store_name: "Store One",
        mode: "tenant_managed",
        status: "in_transit",
        tracking_reference: null,
        items: [
          {
            order_item_uuid: "019bf642-c317-7253-a8fc-85d11fcb2a52",
            name: "Product One",
            quantity: 3,
            prepared: 3,
            handed_off: 2,
            delivered: 1,
            canceled: 0,
          },
        ],
        timeline: [
          {
            uuid: "019bf642-c317-7253-a8fc-85d11fcb2a53",
            type: "in_transit",
            occurred_at: "2026-09-29T12:00:00+00:00",
          },
        ],
      },
    ],
  },
};

describe("GetOrderTrackingResponsePayload", () => {
  it("accepts store delivery progress without a fabricated carrier reference", () => {
    expect(GetOrderTrackingResponsePayload.safeParse(payload).success).toBe(
      true,
    );
  });

  it("rejects delivery counts outside the integer contract", () => {
    const invalidPayload = structuredClone(payload);
    invalidPayload.tracking.delivery_units[0].items[0].delivered = 1.5;

    expect(
      GetOrderTrackingResponsePayload.safeParse(invalidPayload).success,
    ).toBe(false);
  });

  it("strips internal event details from buyer tracking", () => {
    const parsed = GetOrderTrackingResponsePayload.parse({
      ...payload,
      tracking: {
        ...payload.tracking,
        delivery_units: [
          {
            ...payload.tracking.delivery_units[0],
            timeline: [
              {
                ...payload.tracking.delivery_units[0].timeline[0],
                actor_user_uuid: "internal-actor",
                idempotency_key: "internal-key",
              },
            ],
          },
        ],
      },
    });

    expect(parsed.tracking.delivery_units[0].timeline[0]).not.toHaveProperty(
      "actor_user_uuid",
    );
  });
});
