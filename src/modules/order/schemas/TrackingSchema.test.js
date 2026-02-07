import {describe, expect, test} from "bun:test";
import {
    OrderTrackingTimelineItemSchema,
    normalizeTrackingChangedAt,
} from "./TrackingSchema";

describe("normalizeTrackingChangedAt", () => {
    test("normalizes supported datetime formats to ISO-8601", () => {
        const samples = [
            "2026-02-07T10:11:12Z",
            "2026-02-07T10:11:12+00:00",
            "2026-02-07T10:11:12.123456+00:00",
            "2026-02-07 10:11:12",
        ];

        for (const sample of samples) {
            const normalized = normalizeTrackingChangedAt(sample);
            expect(typeof normalized).toBe("string");
            expect(normalized.includes("T")).toBeTrue();
            expect(normalized.endsWith("Z")).toBeTrue();
        }
    });
});

describe("OrderTrackingTimelineItemSchema", () => {
    test("accepts and normalizes changed_at values", () => {
        const parsed = OrderTrackingTimelineItemSchema.safeParse({
            status: "confirmed",
            title: "Processing",
            description: "Order is being processed",
            changed_at: "2026-02-07 10:11:12",
            is_current: true,
        });

        expect(parsed.success).toBeTrue();
        if (parsed.success) {
            expect(parsed.data.changed_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
            expect(parsed.data.changed_at.endsWith("Z")).toBeTrue();
        }
    });

    test("fails on unparseable changed_at values", () => {
        const parsed = OrderTrackingTimelineItemSchema.safeParse({
            status: "confirmed",
            title: "Processing",
            description: "Order is being processed",
            changed_at: "not-a-date",
            is_current: true,
        });

        expect(parsed.success).toBeFalse();
    });
});
