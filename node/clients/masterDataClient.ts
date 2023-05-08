import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class MasterDataClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br/api/dataentities`,
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

  public async getClient(clientId: string) {
    console.log("+++++++++++++++++++++++++++++"+clientId);
    return this.http.getRaw(`CL/search?_fields=_all&userId=${clientId}`)
  }

  public async getAddresses(clientId: string) {
    return this.http.getRaw(`AD/search?_fields=_all&userId=${clientId}`)
  }
}
