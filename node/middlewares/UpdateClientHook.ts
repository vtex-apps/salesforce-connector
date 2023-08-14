import { json } from "co-body";
import SalesforceClient from "../service/SalesforceClientService";
import { CODE_STATUS_200, CODE_STATUS_201, CODE_STATUS_500 } from "../utils/constans";
import MasterDataService from "../service/MasterDataService";
import { ParameterList } from "../schemas/Parameter";
import { getHttpVTX } from "../utils/HttpUtil";

export async function updateClientHook(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterDataClient },
    req,
  } = ctx

  try {
    const args = await json(req);
    const clientVtex = args.version === 'V1' ? await masterDataClient.getClient(args.userId, args.version) : await masterDataClient.getClient(args.id, args.version);
    const address = await masterDataClient.getAddresses(args.id, args.version);
    const httpVTX = await getHttpVTX(ctx.vtex.authToken);
    const masterDataService = new MasterDataService();
    const resultParameters = await masterDataService.getParameters(ctx.vtex.account, httpVTX);
    const parameterList = new ParameterList(resultParameters.data);
    const salesforceCliente = new SalesforceClient();
    const clientSalesforce = await salesforceCliente.get(clientVtex.email, parameterList.get('ACCESS_TOKEN_SALEFORCE') || '');
    if (clientSalesforce.data.records.length !== 0 && clientVtex.email === clientSalesforce.data.records[0].Email) {
      const updateContact = await salesforceCliente.update(clientVtex, address, clientSalesforce.data.records[0].Id, parameterList.get('ACCESS_TOKEN_SALEFORCE') || '');
      ctx.status = CODE_STATUS_200;
      ctx.body = updateContact;
    } else {
      const createContact = await salesforceCliente.create(clientVtex, address, parameterList.get('ACCESS_TOKEN_SALEFORCE') || '');
      ctx.status = CODE_STATUS_201;
      ctx.body = createContact;
    }
  } catch (error) {
    console.error('error', error)
    ctx.status = CODE_STATUS_500
    ctx.body = error
  }

  await next();
}
