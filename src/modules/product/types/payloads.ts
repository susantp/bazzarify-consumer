import { IProduct } from "@/modules/product/types/product";
import { IImage } from "@/modules/product/types/image";
import { ISimplePaginated } from "@/modules/core/data";

interface IProductWithImage
  extends Omit<
    IProduct,
    | "id"
    | "box_items"
    | "specifications"
    | "highlights"
    | "status"
    | "description"
  > {
  image: IImage[];
}

export interface IFlashDealsPayload {
  flashDeals: ISimplePaginated<IProductWithImage[]>;
}
