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
          // Token hard-coded while testing in developing phase
          // Token shouf be copied from master environment
         //VtexIdClientAutCookie: "eyJhbGciOiJFUzI1NiIsImtpZCI6IkI5OUE4QzhCOUE4QzM5RTgyNEJDNEJEMThDMkRENERFOEI5OTc4NkUiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJhbmRyZXMubW9yZW5vQHZ0ZXguY29tLmJyIiwiYWNjb3VudCI6ImZlbGlwZWRldiIsImF1ZGllbmNlIjoiYWRtaW4iLCJzZXNzIjoiM2M4OTQxMTItZTk3My00MjgzLTkwYWYtNmNiYzMxOTcxZDMzIiwiZXhwIjoxNjgzNDAzNzAyLCJ1c2VySWQiOiI1Nzg1MTljMi04N2IwLTRiMmYtODk0NS1lMDM0N2U2M2Y4MTkiLCJpYXQiOjE2ODMzMTczMDIsImlzcyI6InRva2VuLWVtaXR0ZXIiLCJqdGkiOiIxYWQxYjc0Zi04Y2UzLTQxZjktOTJhYy1hMmU1MDUyMGNmYjYifQ.hUcTKYYxZYEl56r5cXHrOpVkJWPaRiarpQ7vVIuEcSC4qHn9Hwpzy46OiVGcpeEUiv-r90Wql1L14oiI7uNJ6g"

          // You should use this in production
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
