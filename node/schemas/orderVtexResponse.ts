export interface OrderVtexResponse {
  orderId: string;
  status: string;
  value: number;
  creationDate: string;
  items: Item[];
  clientProfileData: ClientProfileData;
}

export interface Item {
  id: string;
  productId: string;
  uniqueId: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface ClientProfileData {
  id: string;
  firtsName: string;
  lastName: string;
  document: string;
  phone: string;
  userProfileId: string;
}
