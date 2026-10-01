import { describe, expect, it } from "bun:test";
import { GetOrdersResponsePayload } from "./GetOrdersResponsePayload";

const orderListPayload = {
  orders: {
    current_page: 1,
    current_page_url: "http://localhost/orders?page=1",
    data: [
      {
        uuid: "01a0f36b-c579-73ca-a915-dcc3c8a7c3f6",
        order_number: "QA-ORDER-1",
        status: "draft",
        placed_at: "2026-09-30T23:30:21+05:45",
        items: [
          {
            uuid: "01a0f36b-c590-71b5-a826-1e940f85cf7f",
            name: "QA Slice F Storefront Proof",
            qty_ordered: 1,
            qty_refunded: 0,
            refund_cases: [],
          },
        ],
      },
    ],
    first_page_url: "http://localhost/orders?page=1",
    from: 1,
    next_page_url: null,
    path: "http://localhost/orders",
    per_page: 5,
    prev_page_url: null,
    to: 1,
  },
};

describe("GetOrdersResponsePayload", () => {
  it("accepts the backend order-list summary and its item projection", () => {
    const parsed = GetOrdersResponsePayload.safeParse(orderListPayload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.orders?.data?.[0]?.uuid).toBe(
        orderListPayload.orders.data[0].uuid,
      );
      expect(parsed.data.orders?.data?.[0]?.items).toHaveLength(1);
    }
  });

  it("still validates item summaries when the backend includes them", () => {
    const withItems = {
      orders: {
        ...orderListPayload.orders,
        data: [
          {
            ...orderListPayload.orders.data[0]!,
            items: [
              {
                uuid: "01a0f36b-c579-73ca-a915-dcc3c8a7c3f7",
                name: "QA Slice F Storefront Proof",
                qty_ordered: 1,
                qty_refunded: 0,
                refund_cases: [],
              },
            ],
          },
        ],
      },
    };

    const parsed = GetOrdersResponsePayload.safeParse(withItems);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.orders?.data?.[0]?.items).toHaveLength(1);
    }
  });

  it("accepts the backend's explicit UTC offset timestamp", () => {
    const withOffset = {
      orders: {
        ...orderListPayload.orders,
        data: [
          {
            ...orderListPayload.orders.data[0]!,
            placed_at: "2026-09-30T23:30:21+00:00",
          },
        ],
      },
    };

    expect(GetOrdersResponsePayload.safeParse(withOffset).success).toBe(true);
  });
});
