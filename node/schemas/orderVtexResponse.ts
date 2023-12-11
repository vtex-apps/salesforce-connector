export interface OrderVtexResponse {
  orderId: string
  sequence: string
  status: string
  value: number
  discounts: number
  ratesAndBenefitsData: RatesAndBenefitsData[]
  creationDate: string
  paymentSystemName: string
  shippingType: string
  items: Item[]
  clientProfileData: ClientProfileData
  address: Address
}

export interface RatesAndBenefitsData {
  name: string
}

export interface Item {
  id: string
  productId: string
  uniqueId: string
  name: string
  quantity: number
  measurementUnit: string
  price: number
  imageUrl: string
  refId: string
  sellingPrice: number
}

export interface ClientProfileData {
  id: string
  firtsName: string
  lastName: string
  document: string
  phone: string
  userProfileId: string
}

export interface Address {
  street: string
  city: string
  state: string
  country: string
  postalCode: string
}
