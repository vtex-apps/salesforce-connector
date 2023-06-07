import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import { OrderVtexResponse } from '../schemas/orderVtexResponse';

export default class OMS extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br/api/oms/pvt/orders`,
      context,
      {
        ...options,
        headers: {          
           VtexIdClientAutCookie:
             context.adminUserAuthToken ??
             context.storeUserAuthToken ??
             context.authToken,
        },
      }
    )
  }

  public async getOrder(orderId: string) {
    const response = await this.http.getRaw(`/${orderId}`)
    const items = response.data.items.map((item: any) => {
      return {
        id: item.id,
        productId: item.productId,
        uniqueId: item.uniqueId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageUrl,
      }
    });
    const orderVtexResponse: OrderVtexResponse = {
      orderId: response.data.orderId,
      status: response.data.status,
      value: response.data.value,
      creationDate: response.data.creationDate,
      items: items,
      clientProfileData: {
        id: response.data.clientProfileData.id,
        firtsName: response.data.clientProfileData.firstName,
        lastName: response.data.clientProfileData.lastName,
        document: response.data.clientProfileData.document,
        phone: response.data.clientProfileData.phone,
        userProfileId: response.data.clientProfileData.userProfileId,
      }
    }
    return orderVtexResponse;
  }
}
