import type { Parameter, ParameterList } from '../schemas/Parameter'
import { Result } from '../schemas/Result'
import { getHttpToken, getHttpVTX, getSoapToken } from '../utils/HttpUtil'
import { ACCOUNT_ID, LIST_PRICE_ID } from '../utils/constans'
import MasterDataService from './MasterDataService'
import SalesforceConfigurationService from './SalesforceConfigurationService'

export default class ConfigurationService {
  public proccessConfiguration = async (
    ctx: Context,
    parameterList: ParameterList,
    nameField: number
  ): Promise<Result> => {
    try {
      const masterDataService = new MasterDataService()
      const httpVTX = await getHttpVTX(ctx.vtex.authToken)
      const listPriceId = parameterList.get(LIST_PRICE_ID)
      const accountId = parameterList.get(ACCOUNT_ID)
      const http = await getHttpToken(parameterList)
      const httpSoap = await getSoapToken(parameterList)
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

      if (nameField === 0) {
        await salesforceConfigurationService.createCustomField(
          httpSoap,
          parameterList
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
