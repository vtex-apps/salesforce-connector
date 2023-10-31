import { ParameterList } from '../schemas/Parameter'
import ConfigurationService from '../service/ConfigurationService'
import MasterDataService from '../service/MasterDataService'
import SalesforceClient from '../service/SalesforceClientService'
import SalesforceConfigurationService from '../service/SalesforceConfigurationService'
import { getHttpLogin, getHttpToken, getHttpVTX } from '../utils/HttpUtil'
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

    const salesforceConfigurationService = new SalesforceConfigurationService()
    const resultCustomFieldExists = await salesforceConfigurationService.getFielsOrder(
      http
    )

    const orderStatusField = resultCustomFieldExists.data.fields.filter(
      (field: any) => field.name === 'Order_Status__c'
    )

    const paymentMethodField = resultCustomFieldExists.data.fields.filter(
      (field: any) => field.name === 'Payment_Method__c'
    )

    const discountField = resultCustomFieldExists.data.fields.filter(
      (field: any) => field.name === 'Discount__c'
    )

    const promotionsNameField = resultCustomFieldExists.data.fields.filter(
      (field: any) => field.name === 'Promotions__c'
    )

    const fields = [
      orderStatusField.length,
      paymentMethodField.length,
      discountField.length,
      promotionsNameField.length,
    ]

    const configurationService = new ConfigurationService()

    await configurationService.proccessConfiguration(ctx, parameterList, fields)
    ctx.status = CODE_STATUS_200
    ctx.body = 'OK'
  } catch (error) {
    ctx.status = CODE_STATUS_500
    ctx.body = error
  }

  await next()
}
