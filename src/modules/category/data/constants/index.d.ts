export type CategoriesItemData = {
  id: string;
  name: string;
  children?: CategoriesItemData[];
};
