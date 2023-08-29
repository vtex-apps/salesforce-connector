import { json } from "co-body";
import { ACCOUNT_SALESFORCE, CLIENT_ID, CLIENT_SECRET, CODE_STATUS_200, CODE_STATUS_500 } from "../utils/constans";
import { Parameter } from "../schemas/Parameter";
import MasterDataService from "../service/MasterDataService";
import { getHttpVTX } from "../utils/HttpUtil";

export async function addCredentialsHook(ctx: Context, next: () => Promise<any>) {
  const {
    req,
  } = ctx

  try {
    const args = await json(req);
    const masterDataService = new MasterDataService();
    const httpVTX = await getHttpVTX(ctx.vtex.authToken);
    const parameterAccountSaleforce: Parameter = {
      id: ACCOUNT_SALESFORCE,
      parameterValue: args.accountSalesforce,
      description: "Cuenta de salesforce",
      groupName: "SALESFORCE",
    }
    await masterDataService.saveUpdateParameter(parameterAccountSaleforce, ctx.vtex.account, httpVTX);
    const parameterClientId: Parameter = {
      id: CLIENT_ID,
      parameterValue: args.clientId,
      description: "Client Id de la cuenta de salesforce",
      groupName: "SALEFORCE",
    }
    await masterDataService.saveUpdateParameter(parameterClientId, ctx.vtex.account, httpVTX);
    const parameterClientSecret: Parameter = {
      id: CLIENT_SECRET,
      parameterValue: args.clientSecret,
      description: "Client Secret de la cuenta de salesforce",
      groupName: "SALEFORCE",
    }
    await masterDataService.saveUpdateParameter(parameterClientSecret, ctx.vtex.account, httpVTX);
    ctx.status = CODE_STATUS_200;
    ctx.body = "OK";
  } catch (error) {
    ctx.status = CODE_STATUS_500
    ctx.body = error
  }

  await next();
}
