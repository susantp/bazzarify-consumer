import { z } from "zod";

export const AttributeSchema = z.object({
	uuid: z.uuid(),
	name: z.string().min(1),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	deleted_at: z.coerce.date().nullable(),
});

export const AttributeValueSchema = z.object({
	uuid: z.uuid(),
	attribute_uuid: z.uuid(),
	label: z.string().min(1).max(50),
	code: z.string().min(1).max(20),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	deleted_at: z.coerce.date().nullable(),
});

export type TAttributeValue = z.infer<typeof AttributeValueSchema>;
export type TAttribute = z.infer<typeof AttributeSchema>;
