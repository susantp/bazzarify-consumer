import { IImage } from "@/modules/product/types/image";

export interface ICategory {
  uuid: string;
  id?: string;
  name: string;
  position?: string;
  slug: string;
  specifications?: string[];
  attributes?: string[];
}

export interface ICategoryWithRecursiveParentChildren extends ICategory {
  parent?: ICategory;
  children?: ICategory[];
}

export interface ICategoryListWithImage
  extends Omit<ICategory, "id" | "position" | "specifications" | "attributes"> {
  images: IImage[];
}
