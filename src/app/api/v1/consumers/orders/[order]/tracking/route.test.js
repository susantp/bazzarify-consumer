import {describe, expect, test} from "bun:test";
import {parseTrackingUpstreamResponse} from "./route";

const buildTrackingUpstream = (changedAt) => ({
    data: {
        message: "success",
        payload: {
            tracking: {
                order_uuid: "019bf642-c303-7221-b9ce-7a6d8bce7a1d",
                order_number: "ORD-TRACK-001",
                tracking_number: "ORD-TRACK-001",
                current_status: "confirmed",
                estimated_delivery_window: {
                    from: "2026-02-07",
                    to: "2026-02-10",
                },
                timeline: [
                    {
                        status: "draft",
                        title: "Order Received",
                        description: "Your order has been received",
                        changed_at: changedAt,
                        is_current: false,
                    },
                ],
            },
        },
    },
    metaData: {
        error: "",
        executionTime: 0,
        errorCode: 200,
    },
});

describe("parseTrackingUpstreamResponse", () => {
    test("parses acceptable changed_at formats", () => {
        const samples = [
            "2026-02-07T10:11:12Z",
            "2026-02-07T10:11:12+00:00",
            "2026-02-07T10:11:12.123456+00:00",
            "2026-02-07 10:11:12",
            null,
        ];

        for (const sample of samples) {
            const parsed = parseTrackingUpstreamResponse(buildTrackingUpstream(sample));
            expect(parsed.success).toBeTrue();
        }
    });

    test("fails for invalid changed_at values", () => {
        const parsed = parseTrackingUpstreamResponse(
            buildTrackingUpstream("definitely-not-a-date"),
        );
        expect(parsed.success).toBeFalse();
    });
});
