import { IImage } from "@/modules/product/types/image";
import { TVariant } from "@/modules/product/types/variant";

export interface IProduct {
  type: "retail" | "wholesale";
  uuid: string;
  image_base_path?: string;
  image_base_url?: string;
  id: string;
  name: string;
  slug: string;
  base_price: number;
  description?: string;
  highlights?: string;
  box_items?: string;
  status_text: string;
  status: number;
  specifications: Record<string, string>;
}

export interface IProductWithVariantAndImage extends IProduct {
  variants: TVariant[];
  images: IImage[];
}

export interface IOmittedProductWithImage
  extends Omit<
    IProduct,
    | "id"
    | "box_items"
    | "specifications"
    | "highlights"
    | "status"
    | "description"
  > {
  images: IImage[];
}
