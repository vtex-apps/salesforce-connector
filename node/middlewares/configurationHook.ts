import { ParameterList } from '../schemas/Parameter'
import ConfigurationService from '../service/ConfigurationService'
import MasterDataService from '../service/MasterDataService'
import SalesforceClient from '../service/SalesforceClientService'
import SalesforceConfigurationService from '../service/SalesforceConfigurationService'
import { getHttpLogin, getHttpToken, getHttpVTX } from '../utils/HttpUtil'
import { CODE_STATUS_200, CODE_STATUS_500 } from '../utils/constans'

export async function configurationHook(
  ctx: Context,
  next: () => Promise<void>
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
      (field: { name: string }) => field.name === 'Order_Status__c'
    )

    const paymentMethodField = resultCustomFieldExists.data.fields.filter(
      (field: { name: string }) => field.name === 'Payment_Method__c'
    )

    const discountField = resultCustomFieldExists.data.fields.filter(
      (field: { name: string }) => field.name === 'Discounts__c'
    )

    const promotionsNameField = resultCustomFieldExists.data.fields.filter(
      (field: { name: string }) => field.name === 'Promotions__c'
    )

    const createdBy = resultCustomFieldExists.data.fields.filter(
      (field: { name: string }) => field.name === 'Created_By__c'
    )

    const shippingType = resultCustomFieldExists.data.fields.filter(
      (field: { name: string }) => field.name === 'Shipping_Type__c'
    )

    const fields = [
      orderStatusField.length,
      paymentMethodField.length,
      discountField.length,
      promotionsNameField.length,
      createdBy.length,
      shippingType.length,
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
