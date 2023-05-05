import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import { request } from 'http'

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

  public async getClient() {
    const response = request({
      host: 'https://login.salesforce.com/services/oauth2/token',
      method: 'POST',
      path: `?grant_type=password&client_id=3MVG9gtDqcOkH4PKx5GaxzwrPnOsL886NZvqUj3hQddpkMGoEXP_KVm.Sg0tW8l34hWD1amdP3Hl_X9EbLZE1&client_secret=4BF9EA8BC9EA6CAA2CE2505E50BE695F7802AF4414CCE2E048D7356492E279FB&username=giovannyj@titamedia.com&password=P@sto123NgVRH5yg0xLjIeGJseqp80In`,
    })

    // const token = await fetch('https://login.salesforce.com/services/oauth2/token' + '?' + new URLSearchParams(params))

    console.log(response);
  }
}
