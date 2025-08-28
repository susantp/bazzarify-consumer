export interface IProduct {
  type: "retail" | "wholesale";
  uuid: string;
  image_base_path?: string;
  image_base_url?: string;
  id: string;
  name: string;
  slug: string;
  base_price: string;
  description?: string;
  highlights?: string;
  box_items?: string;
  status_text: string;
  status: string;
  specifications: Record<string, string>;
}
