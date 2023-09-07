import { json } from 'co-body'

import { ACCESS_TOKEN_SALEFORCE, CODE_STATUS_500 } from '../utils/constans'
import SalesforceClient from '../service/SalesforceClientService'
import SalesforceOpportunityService from '../service/SalesforceOpportunityService'
import { getHttpToken, getHttpVTX } from '../utils/HttpUtil'
import MasterDataService from '../service/MasterDataService'
import { ParameterList } from '../schemas/Parameter'
import OpportunityService from '../service/OpportunityService'

export async function abandonedCartHook(
  ctx: Context,
  next: () => Promise<any>
) {
  const { req } = ctx

  try {
    const args = await json(req)
    const httpVTX = await getHttpVTX(ctx.vtex.authToken)
    const masterDataService = new MasterDataService()
    const resultParameters = await masterDataService.getParameters(
      ctx.vtex.account,
      httpVTX
    )

    const parameterList = new ParameterList(resultParameters.data)
    const salesforceClient = new SalesforceClient()
    const userSalesforce = await salesforceClient.getUser(
      args.email,
      parameterList.get(ACCESS_TOKEN_SALEFORCE) || ''
    )

    const userSalesforceId = userSalesforce.data.records[0].Id
    const http = await getHttpToken(
      parameterList.get(ACCESS_TOKEN_SALEFORCE) || ''
    )

    const salesforceOpportunity = new SalesforceOpportunityService()
    const resultCreateOpportunity = await salesforceOpportunity.createOpportunity(
      args,
      parameterList,
      userSalesforceId,
      http
    )

    const opportunityService = new OpportunityService()
    const resultProcessOpportunity = await opportunityService.processOpporunity(
      args,
      resultCreateOpportunity.data.id,
      parameterList.get(ACCESS_TOKEN_SALEFORCE) || '',
      parameterList,
      ctx.vtex.authToken,
      ctx.vtex.account
    )

    ctx.status = resultProcessOpportunity.status
    ctx.body = resultProcessOpportunity.data
  } catch (error) {
    ctx.status = CODE_STATUS_500
    ctx.body = error
  }

  await next()
}
