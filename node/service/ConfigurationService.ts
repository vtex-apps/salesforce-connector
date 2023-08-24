import { json } from "co-body";
import { Parameter, ParameterList } from "../schemas/Parameter";
import { Result } from "../schemas/Result";
import { getHttpToken, getHttpVTX, getSoapToken } from "../utils/HttpUtil";
import { ACCOUNT_ID, ACCOUNT_SALESFORCE, CLIENT_ID, CLIENT_SECRET, LIST_PRICE_ID } from "../utils/constans";
import MasterDataService from "./MasterDataService";
import SalesforceConfigurationService from "./SalesforceConfigurationService";

export default class ConfigurationService {
  public proccessConfiguration = async (accessToken: string, ctx: Context, parameterList: ParameterList, nameField: number): Promise<Result> => {
    try {
      const args = await json(ctx.req);
      const masterDataService = new MasterDataService();
      const httpVTX = await getHttpVTX(ctx.vtex.authToken);
      const listPriceId = parameterList.get(LIST_PRICE_ID);
      const accountId = parameterList.get(ACCOUNT_ID);
      const http = await getHttpToken(accessToken);
      const httpSoap = await getSoapToken(accessToken);
      const salesforceConfigurationService = new SalesforceConfigurationService();
      if (listPriceId === undefined) {
        const resultPriceBook = await salesforceConfigurationService.createPricebook(http);
        const priceBook: Parameter = {
          id: LIST_PRICE_ID,
          parameterValue: resultPriceBook.data.id,
          description: "Identificador de la lista de precios estandar",
          groupName: "PRICEBOOK",
        }
        await masterDataService.saveUpdateParameter(priceBook, ctx.vtex.account, httpVTX);
      }
      if (accountId === undefined) {
        const resultAccount = await salesforceConfigurationService.createAccount(http);
        const account: Parameter = {
          id: ACCOUNT_ID,
          parameterValue: resultAccount.data.id,
          description: "Identificador de la cuenta",
          groupName: "ACCOUNT",
        }
        await masterDataService.saveUpdateParameter(account, ctx.vtex.account, httpVTX);
      }
      if (nameField === 0) {
        await salesforceConfigurationService.createCustomField(accessToken, httpSoap);
      }
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
      return Result.TaskOk('Configuration completed successfully');
    } catch (error) {
      return Result.TaskResult(500, "an error occurred while processing the configuration", error)
    }
  }
}
