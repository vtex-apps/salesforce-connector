import { ParameterList } from "../schemas/Parameter";
import ConfigurationService from "../service/ConfigurationService";
import CreateEntitiesMasterDataV2Service from "../service/CreateEntitiesMasterDataV2Service";
import MasterDataService from "../service/MasterDataService";
import SalesforceConfigurationService from "../service/SalesforceConfigurationService";
import { getHttpVTX } from "../utils/HttpUtil";
import { CODE_STATUS_200, CODE_STATUS_500 } from "../utils/constans";

export async function configurationHook(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterDataClient },
  } = ctx

  try {
    const httpVTX = await getHttpVTX(ctx.vtex.authToken);
    const responseCreateTrigger = await masterDataClient.createTrigger(httpVTX);
    console.log(responseCreateTrigger)
    const createEntitiesMasterDataV2Hook = new CreateEntitiesMasterDataV2Service();
    const responseCreateEntities = await createEntitiesMasterDataV2Hook.createEntity(ctx, httpVTX);
    console.log(responseCreateEntities)
    const masterDataService = new MasterDataService();
    const resultParameters = await masterDataService.getParameters(ctx.vtex.account, httpVTX);
    const parameterList = new ParameterList(resultParameters.data);
    const salesforceConfigurationService = new SalesforceConfigurationService();
    const resultCustomFieldExists = await salesforceConfigurationService.getFielsOrder(parameterList.get('ACCESS_TOKEN_SALEFORCE') || '');
    const nameField = resultCustomFieldExists.data.fields.filter((field: any) => field.name === 'Order_Status__c');
    const configurationService = new ConfigurationService();
    const responseConfiguration = await configurationService.proccessConfiguration(parameterList.get('ACCESS_TOKEN_SALEFORCE') || '', ctx, parameterList, nameField.length);
    console.log(responseConfiguration)
    ctx.status = CODE_STATUS_200;
    ctx.body = "OK";
  } catch (error) {
    ctx.status = CODE_STATUS_500;
    ctx.body = error.response.data;
  }

  await next();
}
