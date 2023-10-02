import type {
  ClientsConfig,
  ServiceContext,
  RecorderState,
  EventContext,
  IOContext,
} from '@vtex/api'
import { method, LRUCache, Service } from '@vtex/api'
import * as dotenv from 'dotenv'

import { Clients } from './clients'
import { orderState } from './middlewares/orderState'
import { updateClientHook } from './middlewares/UpdateClientHook'
import { abandonedCartHook } from './middlewares/AbandonedCartHook'
import { configurationHook } from './middlewares/configurationHook'
import { addCredentialsHook } from './middlewares/addCredentialsHook'
import { getParametersHook } from './middlewares/getParametersHook'

dotenv.config()

const TIMEOUT_MS = 800

const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    status: {
      memoryCache,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface StatusChangeContext extends EventContext<Clients> {
    vtex: IOContext
    body: {
      domain: string
      orderId: string
      currentState: string
      lastState: string
      currentChangeDate: string
      lastChangeDate: string
    }
  }

  interface State extends RecorderState {
    code: number
  }
}

export default new Service({
  clients,
  events: {
    orderState,
  },
  routes: {
    UpdateClientHook: method({
      POST: [updateClientHook],
    }),
    AbandonedCartHook: method({
      POST: [abandonedCartHook],
    }),
    AddCredentialsHook: method({
      POST: [addCredentialsHook],
    }),
    ConfigurationHook: method({
      POST: [configurationHook],
    }),
    GetParametersHook: method({
      GET: [getParametersHook],
    }),
  },
})
