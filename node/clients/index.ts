import { IOClients } from '@vtex/api'

import MasterDataClient from './masterDataClient'
import OMS from './omsClient'

export class Clients extends IOClients {
  public get masterDataClient() {
    return this.getOrSet('masterDataClient', MasterDataClient)
  }

  public get omsClient() {
    return this.getOrSet('omsClient', OMS)
  }
}
