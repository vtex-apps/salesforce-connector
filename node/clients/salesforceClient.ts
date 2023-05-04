import { request } from 'http'

export default class SalesforceClient {
  public async getClient() {
    request({
      host: 'https://login.salesforce.com/services/oauth2/token',
      method: 'POST',
      path: `?grant_type=password&client_id=3MVG9gtDqcOkH4PKx5GaxzwrPnOsL886NZvqUj3hQddpkMGoEXP_KVm.Sg0tW8l34hWD1amdP3Hl_X9EbLZE1&client_secret=4BF9EA8BC9EA6CAA2CE2505E50BE695F7802AF4414CCE2E048D7356492E279FB&username=giovannyj@titamedia.com&password=P@sto123NgVRH5yg0xLjIeGJseqp80In`,
    })
  }
}
