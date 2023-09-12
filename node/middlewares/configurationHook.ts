import { ParameterList } from '../schemas/Parameter'
import ConfigurationService from '../service/ConfigurationService'
import MasterDataService from '../service/MasterDataService'
import SalesforceConfigurationService from '../service/SalesforceConfigurationService'
import { getHttpToken, getHttpVTX } from '../utils/HttpUtil'
import { CODE_STATUS_200, CODE_STATUS_500 } from '../utils/constans'

export async function configurationHook(
  ctx: Context,
  next: () => Promise<any>
) {
  try {
    const httpVTX = await getHttpVTX(ctx.vtex.authToken)
    const masterDataService = new MasterDataService()
    const resultParameters = await masterDataService.getParameters(
      ctx.vtex.account,
      httpVTX
    )

    const parameterList = new ParameterList(resultParameters.data)
    const http = await getHttpToken(parameterList)

    const salesforceConfigurationService = new SalesforceConfigurationService()
    const resultCustomFieldExists = await salesforceConfigurationService.getFielsOrder(
      http
    )

    const nameField = resultCustomFieldExists.data.fields.filter(
      (field: any) => field.name === 'Order_Status__c'
    )

    const configurationService = new ConfigurationService()

    await configurationService.proccessConfiguration(
      ctx,
      parameterList,
      nameField.length
    )
    ctx.status = CODE_STATUS_200
    ctx.body = 'OK'
  } catch (error) {
    ctx.status = CODE_STATUS_500
    ctx.body = error
  }

  await next()
}
