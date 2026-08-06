import { IImage } from "@/modules/product/types/image";
import { IAttribute } from "@/modules/product/types/attribute";
import { IAttributeValue } from "@/modules/product/types/attributeValue";

export interface TVariant {
	uuid?: string;
	name: string;
	image_base_path?: string;
	image_base_url?: string;
	stock?: string;
	price?: string;
	sku?: string;
	images?: (string | File | IImage)[];
	isValid?: boolean;
	available?: boolean;
	attributes?: { attribute: IAttribute; attribute_value: IAttributeValue }[];
}
