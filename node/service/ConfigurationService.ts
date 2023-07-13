import { Parameter, ParameterList } from "../schemas/Parameter";
import { Result } from "../schemas/Result";
import { getHttpVTX } from "../utils/HttpUtil";
import { ACCOUNT_ID, LIST_PRICE_ID } from "../utils/constans";
import MasterDataOrderService from "./MasterDataOrderService";
import SalesforceConfigurationService from "./SalesforceConfigurationService";

export default class ConfigurationService {
  public proccessConfiguration = async (accessToken: string, ctx: StatusChangeContext, parameterList: ParameterList, nameField: number): Promise<Result> => {
    try {
      const masterDataService = new MasterDataOrderService();
      const httpVTX = await getHttpVTX(ctx.vtex.authToken);
      const listPriceId = parameterList.get(LIST_PRICE_ID);
      const accountId = parameterList.get(ACCOUNT_ID);
      const salesforceConfigurationService = new SalesforceConfigurationService();
      if (listPriceId === undefined) {
        const resultPriceBook = await salesforceConfigurationService.createPricebook(accessToken);
        const priceBook: Parameter = {
          id: LIST_PRICE_ID,
          parameterValue: resultPriceBook.data.id,
          description: "Identificador de la lista de precios estandar",
          groupName: "PRICEBOOK",
        }
        await masterDataService.saveParameter(priceBook, ctx.vtex.account, httpVTX);
      }
      if (accountId === undefined) {
        const resultAccount = await salesforceConfigurationService.createAccount(accessToken);
        const account: Parameter = {
          id: ACCOUNT_ID,
          parameterValue: resultAccount.data.id,
          description: "Identificador de la cuenta",
          groupName: "ACCOUNT",
        }
        await masterDataService.saveParameter(account, ctx.vtex.account, httpVTX);
      }
      if (nameField === 0) {
        const resultCustomField = await salesforceConfigurationService.createCustomField(accessToken);
        console.log(resultCustomField.data);
      }
      return Result.TaskOk('Configuration completed successfully');
    } catch (error) {
      console.log(error);
      return Result.TaskResult(500, "an error occurred while processing the configuration", error)
    }
  }
}
