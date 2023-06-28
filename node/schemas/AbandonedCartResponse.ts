import { Item } from "./orderVtexResponse";

export interface AbandonedCartResponse {
  email: string;
  carttag: string;
  rclastsessiondate: string;
  rclastcartvalue: number;
  additionalfields: Fields;
  items: Item[];
}

export interface Fields {
  firstname: string;
}