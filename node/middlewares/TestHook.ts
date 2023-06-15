import { json } from "co-body";
import { CODE_STATUS_200, CODE_STATUS_500 } from "../utils/constans";
import OrderService from "./OrderService";
import MasterDataOrderService from "../service/MasterDataOrderService";
import { getHttpVTX } from "../utils/HttpUtil";
import { ParameterList } from "../schemas/Parameter";

export async function TestHook(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { omsClient },
    req,
  } = ctx

  try {
    const body = await json(req);
    const  orderId = body.orderId;
    const order = await omsClient.getOrder(orderId);
    const httpVTX = await getHttpVTX(ctx.vtex.authToken);
    ctx.status = CODE_STATUS_200;
    
    const orderService = new OrderService();
    const masterDataService = new MasterDataOrderService();
    const token = '00DDo000000sWCM!ARYAQFiCYxHPYsRSogKq1dcoQ9dTL01r1WywBqlyGKdBkBYkDcPwq_rPcx2Vq7DdoW.SJfcSiwycqD66k57BXagUET_WfyM5';
    const clientId = '003Do00000HLdYhIAL';
    const resultParameters = await masterDataService.getParameters(ctx, httpVTX);
    const parameters = new ParameterList(resultParameters.data);
    ctx.body = await orderService.processOrder(order, clientId,token, parameters, ctx);
  } catch (error) {
    console.error('error', error)
    ctx.status = CODE_STATUS_500;
    ctx.body = error;
  }
  await next();
}
