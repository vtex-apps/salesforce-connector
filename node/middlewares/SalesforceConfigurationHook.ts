import SalesforceClient from "../clients/salesforceClient";
import { Parameter } from "../schemas/Parameter";
import MasterDataOrderService from "../service/MasterDataOrderService";
import SalesforceConfigurationService from "../service/SalesforceConfigurationService";
import { getHttpVTX } from "../utils/HttpUtil";
import { ACCOUNT_ID, CODE_STATUS_200, CODE_STATUS_500, LIST_PRICE_ID } from "../utils/constans";

export async function SalesforceConfigurationHook(ctx: Context, next: () => Promise<any>) {
  try {
    const salesforceClient = new SalesforceClient();
    const accessToken = await salesforceClient.auth();
    const masterDataService = new MasterDataOrderService();
    const httpVTX = await getHttpVTX(ctx.vtex.authToken);
    const salesforceConfigurationService = new SalesforceConfigurationService();
    const resultPriceBook = await salesforceConfigurationService.createPricebook(accessToken.data);
    const resultAccount = await salesforceConfigurationService.createAccount(accessToken.data);
    const parameters: Parameter[] = [
      {
        id: LIST_PRICE_ID,
        parameterValue: resultPriceBook.data.id,
        description: "Identificador de la lista de precios estandar",
        groupName: "PRICEBOOK",
      },
      {
        id: ACCOUNT_ID,
        parameterValue: resultAccount.data.id,
        description: "Identificador de la cuenta",
        groupName: "ACCOUNT",
      },
    ];
    parameters.forEach(async (parameter) => {
      const resultCreateParameter = await masterDataService.saveParameter(parameter, ctx.vtex.account, httpVTX);
      console.log(resultCreateParameter.status);
      console.log(resultCreateParameter.data);
    });
    ctx.status = CODE_STATUS_200;
    ctx.body = "Configuration completed successfully";
  } catch (error) {
    console.error('error', error)
    ctx.status = CODE_STATUS_500;
    ctx.body = error;
  }
  await next();
}
