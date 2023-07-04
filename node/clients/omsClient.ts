import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import { Item, OrderVtexResponse } from '../schemas/orderVtexResponse';

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
    // TODO: change any to Item type.
    const items = response.data.items.map((item: Item) => {
      return {
        id: item.id,
        productId: item.productId,
        uniqueId: item.uniqueId,
        name: item.name,
        quantity: item.quantity,
        measurementUnit: item.measurementUnit,
        price: item.price,
        imageUrl: item.imageUrl,
        refId: item.refId,
        sellingPrice: item.sellingPrice
      }
    });
    const totalsShipping = response.data.totals.find( (total: { id: string; }) => total.id === 'Shipping');
    console.log(totalsShipping);

    // TODO nullability could be tested just with if (totalShipping && totalShipping.value)
    if(totalsShipping && totalsShipping.value) {
      items.push({
        id: 'SHIPPING-CODE',
        productId: 'SHIPPING-CODE',
        uniqueId: 'SHIPPING-CODE',
        name: 'Item Shipping',
        quantity: 1,
        measurementUnit: "un",
        price: totalsShipping.value,
        imageUrl: '',
        refId: 'SHIPPING-CODE',
        sellingPrice: totalsShipping.value
      });
    }
    const orderVtexResponse: OrderVtexResponse = {
      orderId: response.data.orderId,
      sequence: response.data.sequence,
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
      },
      address: {
        street: response.data.shippingData.address.street,
        city: response.data.shippingData.address.city,
        state: response.data.shippingData.address.state,
        country: response.data.shippingData.address.country,
        postalCode: response.data.shippingData.address.postalCode,
      }
    }
    return orderVtexResponse;
  }
}
