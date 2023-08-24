import SalesforceClient from "../clients/salesforceClient"
import { ParameterList } from "../schemas/Parameter";
import ConfigurationService from "../service/ConfigurationService";
import MasterDataOrderService from "../service/MasterDataOrderService";
import SalesforceConfigurationService from "../service/SalesforceConfigurationService";
import SalesforceOrderService from "../service/SalesforceOrderService";
import { getHttpVTX } from "../utils/HttpUtil";
import { StatusHomologate } from "../utils/StatusOrder";
import { CODE_STATUS_200, CODE_STATUS_500 } from "../utils/constans"
import OrderService from "./OrderService";

export async function orderState(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const {
    clients: { omsClient, masterDataClient },
  } = ctx

  try {
    const { orderId } = ctx.body;
    const { currentState } = ctx.body;
    const { lastState } = ctx.body;
    console.log(currentState);
    console.log(lastState);
    console.log(orderId);
    const httpVTX = await getHttpVTX(ctx.vtex.authToken);
    const salesforceCliente = new SalesforceClient();
    const accessToken = await salesforceCliente.auth();
    const masterDataService = new MasterDataOrderService();
    const resultParameters = await masterDataService.getParameters(ctx.vtex.account, httpVTX);
    const parameterList = new ParameterList(resultParameters.data);
    const salesforceConfigurationService = new SalesforceConfigurationService();
    const resultCustomFieldExists = await salesforceConfigurationService.getFielsOrder(accessToken.data);
    const nameField = resultCustomFieldExists.data.fields.filter((field: any) => field.name === 'Order_Status__c');
    if (parameterList.parameters.length === 0 || nameField.length === 0) {
      const configurationService = new ConfigurationService();
      const resultConfiguration = await configurationService.proccessConfiguration(accessToken.data, ctx, parameterList, nameField.length);
      console.log(resultConfiguration);
    }
    const order = await omsClient.getOrder(orderId);
    const userProfileId = order.clientProfileData.userProfileId;
    const clientVtex = await masterDataClient.getClient(userProfileId, 'V1');
    const address = await masterDataClient.getAddresses(clientVtex.id, 'V1');
    const clientSalesforce = await salesforceCliente.get(clientVtex.email, accessToken.data);
    let clientId = '';
    if (clientSalesforce.data.records.length !== 0 && clientVtex.email === clientSalesforce.data.records[0].Email) {
      clientId = clientSalesforce.data.records[0].Id;
      const updateContact = await salesforceCliente.update(clientVtex, address, clientSalesforce.data.records[0].Id, accessToken.data);
      ctx.state = CODE_STATUS_200;
      ctx.body = updateContact.data;
    } else {
      const createContact = await salesforceCliente.create(clientVtex, address, accessToken.data);
      clientId = createContact.data.id;
    }
    const orderService = new OrderService();
    const salesforceOrderService = new SalesforceOrderService();
    const resultGetOrder = await salesforceOrderService.getOrderById(orderId, accessToken.data);
    console.log(resultGetOrder)
    const ordersFound = resultGetOrder.data;
    if(resultGetOrder.isOk() && ordersFound.records.length > 0){
      console.log('order found')
      //Order found update status
      const statusUpdate = StatusHomologate[currentState];
      console.log(statusUpdate)
      const result = await salesforceOrderService.updateStatusOrder(ordersFound.records[0].Id, currentState, accessToken.data);
      ctx.state = result.status;
      ctx.body = result.data;
      console.log(result.status)
      console.log(result.data)
    }else{
      //Order not found
      console.log('order not found')
      const result = await orderService.processOrder(order, clientId, accessToken.data, parameterList, ctx);
      ctx.state = result.status;
      ctx.body = result.data;
      console.log(result.status)
      console.log(result.data)
    }
  } catch (error) {
    console.error('error', error)
    ctx.state = CODE_STATUS_500
    ctx.body = error
  }

  await next()
}
