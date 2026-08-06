import { UserSchema } from "@/modules/auth/schemas/UserSchema";
import { z } from "zod";
import { SliderStatus } from "@/modules/marketing/sliders/domain/enums/SliderStatus";
import { ImageSchema } from "@/modules/product/schemas/ImageSchema";

export const SliderSchema = z
	.object({
		uuid: z.uuid(),
		title: z
			.string()
			.min(2, { message: "title required must be at least 2 characters" })
			.max(50, { message: "title cannot be more than 50 characters" }),
		link: z.url({ message: "Invalid URL format." }).nullable().optional(),
		status: z
			.string()
			.refine(
				(val) => Object.values(SliderStatus).includes(val as SliderStatus),
				{
					message: "Invalid status value",
				},
			),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		owner: UserSchema.nullable(),
		image_base_path: z.string(),
		image_base_url: z.string(),
	})
	.strip();
export const SliderWithImagesSchema = SliderSchema.extend({
	images: z.array(ImageSchema).optional(),
}).strip();
export type TSlider = z.infer<typeof SliderSchema>;
export type TSliderWithImage = z.infer<typeof SliderWithImagesSchema>;
