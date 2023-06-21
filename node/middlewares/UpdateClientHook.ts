import { json } from "co-body";
import SalesforceClient from "../clients/salesforceClient";
import { CODE_STATUS_200, CODE_STATUS_201, CODE_STATUS_500 } from "../utils/constans";

//TODO: Change 'any' type
export async function UpdateClientHook(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterDataClient },
    req,
  } = ctx

  try {
    const args = await json(req);
    /**
     * TODO: Delete if
     * Use ternary conditional
     */
    const clientVtex = args.version === 'V1' ? await masterDataClient.getClient(args.userId, args.version) : await masterDataClient.getClient(args.id, args.version);
    const address = await masterDataClient.getAddresses(args.id, args.version);
    console.log(address);
    
    const salesforceCliente = new SalesforceClient();
    const responseAuth = await salesforceCliente.auth();
    const clientSalesforce = await salesforceCliente.get(clientVtex, responseAuth.data);

    //TODO: use && to improve this block getting rid of seconde 'else' statement
    if (clientSalesforce.data.records.length !== 0 && clientVtex.email === clientSalesforce.data.records[0].Email) {
      const updateContact = await salesforceCliente.update(clientVtex, address, clientSalesforce.data.records[0].Id, responseAuth.data);
      ctx.status = CODE_STATUS_200;
      ctx.body = updateContact;
    } else {
      const createContact = await salesforceCliente.create(clientVtex, address, responseAuth.data);
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
