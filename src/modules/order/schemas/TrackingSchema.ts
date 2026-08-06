import { z } from "zod";

const hasTimezone = (value: string) => /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);

export const normalizeTrackingChangedAt = (value: unknown): unknown => {
	if (value === null) {
		return null;
	}
	if (typeof value !== "string") {
		return value;
	}

	const raw = value.trim();
	if (raw.length === 0) {
		return value;
	}

	const candidates = new Set<string>([raw]);
	if (raw.includes(" ")) {
		candidates.add(raw.replace(" ", "T"));
	}

	for (const candidate of candidates) {
		const withTimezone = hasTimezone(candidate) ? candidate : `${candidate}Z`;
		const variants = new Set<string>([withTimezone]);

		// JS Date can fail on >3 fractional second digits; try millisecond-trimmed fallback.
		const trimmedFraction = withTimezone.replace(
			/\.(\d{3})\d+(?=(?:Z|[+-]\d{2}:\d{2})$)/,
			".$1",
		);
		variants.add(trimmedFraction);

		for (const variant of variants) {
			const parsed = new Date(variant);
			if (!Number.isNaN(parsed.getTime())) {
				return parsed.toISOString();
			}
		}
	}

	return value;
};

export const OrderTrackingTimelineItemSchema = z
	.object({
		status: z.string(),
		title: z.string(),
		description: z.string().nullable(),
		changed_at: z.preprocess(
			normalizeTrackingChangedAt,
			z.iso.datetime().nullable(),
		),
		is_current: z.boolean(),
	})
	.strip();

export const OrderEstimatedDeliveryWindowSchema = z
	.object({
		from: z.iso.date().nullable(),
		to: z.iso.date().nullable(),
	})
	.strip();

export const OrderTrackingSchema = z
	.object({
		order_uuid: z.uuid(),
		order_number: z.string(),
		tracking_number: z.string(),
		current_status: z.string().nullable(),
		estimated_delivery_window: OrderEstimatedDeliveryWindowSchema,
		timeline: z.array(OrderTrackingTimelineItemSchema),
	})
	.strip();

export type TOrderTrackingTimelineItem = z.infer<
	typeof OrderTrackingTimelineItemSchema
>;
export type TOrderEstimatedDeliveryWindow = z.infer<
	typeof OrderEstimatedDeliveryWindowSchema
>;
export type TOrderTracking = z.infer<typeof OrderTrackingSchema>;
