import { json } from 'co-body'

import { CODE_STATUS_500 } from '../utils/constans'
import SalesforceClient from '../service/SalesforceClientService'
import SalesforceOpportunityService from '../service/SalesforceOpportunityService'
import { getHttpLogin, getHttpToken, getHttpVTX } from '../utils/HttpUtil'
import MasterDataService from '../service/MasterDataService'
import { ParameterList } from '../schemas/Parameter'
import OpportunityService from '../service/OpportunityService'
import type { Item } from '../schemas/orderVtexResponse'
import type { AbandonedCartResponse } from '../schemas/AbandonedCartResponse'

export async function abandonedCartHook(
  ctx: Context,
  next: () => Promise<any>
) {
  const { req } = ctx

  try {
    const args = await json(req)
    const httpVTX = await getHttpVTX(ctx.vtex.authToken)
    const queryParams = new URLSearchParams(args.rclastcart.replace('add?', ''))
    let queryParam: Record<string, string> = {}
    const params: Array<Record<string, string>> = []
    const items: Item[] = []

    queryParams.delete('seller')
    queryParams.delete('sc')

    let cont = 0

    queryParams.forEach((value, key) => {
      const param = { [key]: value }

      queryParam = { ...queryParam, ...param }
      cont++

      if (cont === 2) {
        params.push(queryParam)
        cont = 0
      }
    })

    const masterDataService = new MasterDataService()

    params.forEach(async (param) => {
      const resultInfoSku = await masterDataService.getSku(
        param.sku,
        ctx.vtex.account,
        httpVTX
      )

      const resultProduct = await masterDataService.getProduct(
        resultInfoSku.data.ProductId,
        ctx.vtex.account,
        httpVTX
      )

      items.push({
        id: resultProduct.data.Id,
        productId: '',
        uniqueId: '',
        name: resultProduct.data.Name,
        quantity: Number(param.qty),
        measurementUnit: '',
        price: args.carttag.Scores[param.sku][0].Point * 100,
        imageUrl: '',
        refId: resultProduct.data.RefId,
        sellingPrice: 0,
        priceTags: [],
      })
    })

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

    const salesforceClient = new SalesforceClient()
    const userSalesforce = await salesforceClient.getUser(args.email, http)

    const userSalesforceId = userSalesforce.data.records[0].Id

    const opportunity: AbandonedCartResponse = {
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      rclastsessiondate: args.rclastsessiondate,
      items,
    }

    const salesforceOpportunity = new SalesforceOpportunityService()
    const resultCreateOpportunity = await salesforceOpportunity.createOpportunity(
      opportunity,
      parameterList,
      userSalesforceId,
      http
    )

    const opportunityService = new OpportunityService()
    const resultProcessOpportunity = await opportunityService.processOpporunity(
      opportunity,
      resultCreateOpportunity.data.id,
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
