import type { Item } from './orderVtexResponse'

export interface AbandonedCartResponse {
  email: string
  firstName: string
  lastName: string
  rclastsessiondate: string
  items: Item[]
}

export interface Fields {
  firstname: string
}
