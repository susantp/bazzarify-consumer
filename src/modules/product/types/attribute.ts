import { TAttributeValue } from "@/modules/product/types/attributeValue";

export interface IAttribute {
  uuid: string;
  name: string;
  attribute_value: TAttributeValue[];
}
