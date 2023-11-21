import SalesforceClient from '../service/SalesforceClientService'
import { ParameterList } from '../schemas/Parameter'
import SalesforceOrderService from '../service/SalesforceOrderService'
import { getHttpLogin, getHttpToken, getHttpVTX } from '../utils/HttpUtil'
import { CODE_STATUS_200, CODE_STATUS_500 } from '../utils/constans'
import OrderService from '../service/OrderService'
import MasterDataService from '../service/MasterDataService'

export async function orderState(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const {
    clients: { omsClient, masterDataClient },
  } = ctx

  try {
    const { orderId } = ctx.body
    const { currentState } = ctx.body

    const httpVTX = await getHttpVTX(ctx.vtex.authToken)
    const salesforceClient = new SalesforceClient()
    const masterDataService = new MasterDataService()
    const resultParameters = await masterDataService.getParameters(
      ctx.vtex.account,
      httpVTX
    )

    const parameterList = new ParameterList(resultParameters.data)
    const httpLogin = await getHttpLogin(parameterList)
    const resultLogin = await salesforceClient.login(parameterList, httpLogin)

    const http = await getHttpToken(
      parameterList,
      resultLogin.data.access_token
    )

    const order = await omsClient.getOrder(orderId)
    const { userProfileId } = order.clientProfileData
    const clientVtex = await masterDataClient.getClient(userProfileId, 'V1')
    const address = await masterDataClient.getAddresses(clientVtex.id, 'V1')
    const clientSalesforce = await salesforceClient.get(clientVtex.email, http)

    let clientId = ''

    if (
      clientSalesforce.data.records.length !== 0 &&
      clientVtex.email === clientSalesforce.data.records[0].Email
    ) {
      clientId = clientSalesforce.data.records[0].Id
      const updateContact = await salesforceClient.update(
        clientVtex,
        address,
        clientSalesforce.data.records[0].Id,
        http
      )

      ctx.state = CODE_STATUS_200
      ctx.body = updateContact.data
    } else {
      const createContact = await salesforceClient.create(
        clientVtex,
        address,
        http
      )

      clientId = createContact.data.id
    }

    const orderService = new OrderService()
    const salesforceOrderService = new SalesforceOrderService()
    const resultGetOrder = await salesforceOrderService.getOrderById(
      orderId,
      http
    )

    const ordersFound = resultGetOrder.data

    if (resultGetOrder.isOk() && ordersFound.records.length > 0) {
      // Order found update status
      const result = await salesforceOrderService.updateStatusOrder(
        ordersFound.records[0].Id,
        currentState,
        http
      )

      ctx.state = result.status
      ctx.body = result.data
    } else {
      // Order not found
      const result = await orderService.processOrder(
        order,
        clientId,
        parameterList,
        ctx.vtex.authToken,
        ctx.vtex.account
      )

      ctx.state = result.status
      ctx.body = result.data
    }
  } catch (error) {
    ctx.state = CODE_STATUS_500
    ctx.body = error
  }

  await next()
}
