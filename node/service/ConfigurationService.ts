import type { Parameter, ParameterList } from '../schemas/Parameter'
import { Result } from '../schemas/Result'
import {
  getHttpLogin,
  getHttpToken,
  getHttpVTX,
  getSoapToken,
} from '../utils/HttpUtil'
import { ACCOUNT_ID, LIST_PRICE_ID } from '../utils/constans'
import MasterDataService from './MasterDataService'
import SalesforceClient from './SalesforceClientService'
import SalesforceConfigurationService from './SalesforceConfigurationService'

export default class ConfigurationService {
  public proccessConfiguration = async (
    ctx: Context,
    parameterList: ParameterList,
    fields: number[]
  ): Promise<Result> => {
    try {
      const masterDataService = new MasterDataService()
      const httpVTX = await getHttpVTX(ctx.vtex.authToken)
      const listPriceId = parameterList.get(LIST_PRICE_ID)
      const accountId = parameterList.get(ACCOUNT_ID)
      const salesforceClientService = new SalesforceClient()
      const httpLogin = await getHttpLogin(parameterList)
      const resultLogin = await salesforceClientService.login(
        parameterList,
        httpLogin
      )

      const http = await getHttpToken(
        parameterList,
        resultLogin.data.access_token
      )

      const httpSoap = await getSoapToken(
        parameterList,
        resultLogin.data.access_token
      )

      const salesforceConfigurationService = new SalesforceConfigurationService()

      if (listPriceId === undefined) {
        const resultPriceBook = await salesforceConfigurationService.createPricebook(
          http
        )

        const priceBook: Parameter = {
          id: LIST_PRICE_ID,
          parameterValue: resultPriceBook.data.id,
          description: 'Identificador de la lista de precios estandar',
          groupName: 'SALEFORCE',
        }

        await masterDataService.saveUpdateParameter(
          priceBook,
          ctx.vtex.account,
          httpVTX
        )
      }

      if (accountId === undefined) {
        const resultAccount = await salesforceConfigurationService.createAccount(
          http
        )

        const account: Parameter = {
          id: ACCOUNT_ID,
          parameterValue: resultAccount.data.id,
          description: 'Identificador de la cuenta',
          groupName: 'SALEFORCE',
        }

        await masterDataService.saveUpdateParameter(
          account,
          ctx.vtex.account,
          httpVTX
        )
      }

      if (
        fields[0] === 0 ||
        fields[1] === 0 ||
        fields[2] === 0 ||
        fields[3] === 0
      ) {
        await salesforceConfigurationService.createCustomField(
          httpSoap,
          resultLogin.data.access_token
        )
      }

      return Result.TaskOk('Configuration completed successfully')
    } catch (error) {
      return Result.TaskResult(
        500,
        'an error occurred while processing the configuration',
        error
      )
    }
  }
}
