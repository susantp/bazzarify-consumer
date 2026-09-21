import {z} from "zod";
import {ImageSchema} from "@/modules/product/schemas/ImageSchema";
import SpecificationSchema from "@/modules/product/schemas/SpecificationSchema";
import TimeStampsSchema from "@/modules/core/schemas/TimeStampsSchema";

export const ProductCommerceSchema = z
    .object({
        // Backend: Consumer\Services\ProductService::commerceContract.
        product_type: z.enum(["retail", "wholesale", "virtual"]),
        minimum_order_quantity: z.number().int().positive(),
        enforce_minimum_order_quantity_on_cart: z.boolean(),
        enforce_minimum_order_quantity_on_checkout: z.boolean(),
        mixed_cart_mode: z.string().min(1),
        fulfillment_mode: z.string().min(1),
        cancellation_mode: z.string().min(1),
        refund_mode: z.string().min(1),
        can_purchase: z.boolean().nullable(),
    })
    .strict();

export const ProductSchema = z
    .object({
        type: z.enum(["retail", "wholesale", "virtual"]),
        uuid: z.uuid(),
        user_uuid: z.uuid().nullable(),
        image_base_path: z.string(),
        image_base_url: z.string(),
        id: z.number().nullable(),
        name: z.string(),
        sku: z.string().min(8).max(32),
        slug: z.string(),
        base_price: z.number().nonnegative(),
        description: z.looseObject({}).nullable(),
        highlights: z.looseObject({}).nullable(),
        box_items: z.string().nullable(),
        status_text: z.string(),
        available_to_sell: z.number().int().nonnegative().nullable().optional(),
        can_purchase: z.boolean().nullable().optional(),
        low_stock: z.boolean().nullable().optional(),
        commerce: ProductCommerceSchema.optional(),
        brand_uuid: z.uuid().nullable(),
        status: z.number().nonnegative(),
        brand: z.object().nullable().optional(),
        images: z.union([z.array(ImageSchema).optional(), z.array(z.unknown())]),
    })
    .extend({
        specifications: SpecificationSchema,
    }) //TODO remove this from core product schema, extend it later
    .extend(TimeStampsSchema.shape)
    .strip();
export const OmittedProductWithImagesSchema = ProductSchema.omit({
    id: true,
    box_items: true,
    specifications: true,
    highlights: true,
    description: true,
    brand: true,
    user_uuid: true,
    brand_uuid: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
})
    .extend({
        images: z.array(ImageSchema).optional().nullable(),
    })
    .strip();
