import { ParameterList } from '../schemas/Parameter'
import MasterDataService from '../service/MasterDataService'
import SalesforceClient from '../service/SalesforceClientService'
import SalesforceConfigurationService from '../service/SalesforceConfigurationService'
import { getHttpLogin, getHttpToken, getHttpVTX } from '../utils/HttpUtil'
import {
  ACCOUNT_ID,
  CODE_STATUS_200,
  CODE_STATUS_500,
  LIST_PRICE_ID,
} from '../utils/constans'

export async function getConfigurationHook(
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

    let response = false

    if (
      parameterList.get(LIST_PRICE_ID) &&
      parameterList.get(ACCOUNT_ID) &&
      resultCustomFieldExists.data.fields.filter(
        (field: { name: string }) => field.name === 'Order_Status__c'
      ).length > 0 &&
      resultCustomFieldExists.data.fields.filter(
        (field: { name: string }) => field.name === 'Payment_Method__c'
      ).length > 0 &&
      resultCustomFieldExists.data.fields.filter(
        (field: { name: string }) => field.name === 'Discounts__c'
      ).length > 0 &&
      resultCustomFieldExists.data.fields.filter(
        (field: { name: string }) => field.name === 'Promotions__c'
      ).length > 0 &&
      resultCustomFieldExists.data.fields.filter(
        (field: { name: string }) => field.name === 'Created_By__c'
      ).length > 0 &&
      resultCustomFieldExists.data.fields.filter(
        (field: { name: string }) => field.name === 'Shipping_Type__c'
      ).length > 0 &&
      resultCustomFieldExists.data.fields.filter(
        (field: { name: string }) => field.name === 'Price_List__c'
      ).length > 0
    ) {
      response = true
    }

    ctx.status = CODE_STATUS_200
    ctx.body = response
  } catch (error) {
    ctx.status = CODE_STATUS_500
    ctx.body = error
  }

  await next()
}
