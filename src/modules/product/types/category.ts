import { IAttribute } from "@/modules/product/types/attribute";
import { ISpecification } from "@/modules/product/types/specification";

export interface ICategory {
  uuid: string;
  id: string;
  name: string;
  position?: string;
  slug: string;
  specifications?: string[];
  specifications_with_model?: ISpecification[];
  attributes?: string[];
  attributes_with_model?: IAttribute[];
  parent?: ICategory;
  children?: ICategory[];
}
