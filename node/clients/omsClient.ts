import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

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
    return this.http.getRaw(`/${orderId}`)
  }
}
