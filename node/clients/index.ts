import { IOClients } from '@vtex/api'

import MasterDataClient from './MasterDataClient'
import OMS from './OmsClient'

export class Clients extends IOClients {
  public get masterDataClient() {
    return this.getOrSet('masterDataClient', MasterDataClient)
  }

  public get omsClient() {
    return this.getOrSet('omsClient', OMS)
  }
}
