export type ItemProps = {
  id: string;
  name: string;
  price: number;
  rating?: number;
  discount?: number;
  freeDelivery?: boolean;
  location?: string;
  specialSale?: {
    discount: number;
    discountType: "flat" | "percent";
    endDate: string;
    name: string;
  };
};
