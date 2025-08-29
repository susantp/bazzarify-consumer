import {
  IOmittedProductWithImage,
  IProductWithVariantAndImage,
} from "@/modules/product/types/product";
import { ISimplePaginated } from "@/modules/core/types";

export interface IFlashDealsPayload {
  flashDeals: ISimplePaginated<IOmittedProductWithImage[]>;
}

export interface IProductShowPayload {
  product: IProductWithVariantAndImage;
}
