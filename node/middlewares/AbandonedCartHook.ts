import { json } from "co-body";
import { CODE_STATUS_500 } from "../utils/constans";
import SalesforceClient from "../clients/salesforceClient";
import salesforceOpportunityService from "../service/SalesforceOpportunityService";
import { getHttpVTX } from "../utils/HttpUtil";
import MasterDataOrderService from "../service/MasterDataOrderService";
import { ParameterList } from "../schemas/Parameter";
import OpportunityService from "../service/OpportunityService";

export async function AbandonedCartHook(ctx: Context, next: () => Promise<any>) {
  const {
    req,
  } = ctx

  try {
    const args = await json(req);
    const salesforceCliente = new SalesforceClient();
    const accessToken = await salesforceCliente.auth();
    const userSalesforce = await salesforceCliente.getUser(args.email, accessToken.data)
    const userSalesforceId = userSalesforce.data.records[0].Id;
    const salesforceOpportunity = new salesforceOpportunityService();
    const httpVTX = await getHttpVTX(ctx.vtex.authToken);
    const masterDataService = new MasterDataOrderService();
    const resultParameters = await masterDataService.getParameters(ctx.vtex.account, httpVTX);
    const parameters = new ParameterList(resultParameters.data);
    const resultCreateOpportunity = await salesforceOpportunity.createOpportunity(args, parameters, userSalesforceId, accessToken.data);
    const opportunityService = new OpportunityService();
    const resultProcessOpportunity = await opportunityService.processOpporunity(args, resultCreateOpportunity.data.id, accessToken.data, parameters, ctx);
    ctx.status = resultProcessOpportunity.status;
    ctx.body = resultProcessOpportunity.data;
  } catch (error) {
    console.error('error', error)
    ctx.status = CODE_STATUS_500
    ctx.body = error
  }

  await next();
}
