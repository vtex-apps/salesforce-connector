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
    let clientVtex;
    let adrress;

    /**
     * TODO: Delete if
     * Use ternary conditional
     */
    if (args.version === 'V1') {
      clientVtex = await masterDataClient.getClient(args.userId, args.version);
      adrress = await masterDataClient.getAddresses(args.id, args.version);
    } else {
      clientVtex = await masterDataClient.getClient(args.id, args.version);
      adrress = await masterDataClient.getAddresses(args.id, args.version);
    }

    const salesforceCliente = new SalesforceClient();
    const accessToken = await salesforceCliente.auth();
    const clientSalesforce = await salesforceCliente.get(clientVtex, accessToken);

    //TODO: use && to improve this block getting rid of seconde 'else' statement
    if (clientSalesforce.records.length !== 0) {
      if (clientVtex.data[0].email === clientSalesforce.records[0].Email) {
        const updateContact = await salesforceCliente.update(clientVtex, adrress.data[0], clientSalesforce.records[0].Id, accessToken);
        ctx.status = CODE_STATUS_200;
        ctx.body = updateContact;
      } else {
        const createContact = await salesforceCliente.create(clientVtex, adrress.data[0], accessToken);
        ctx.status = CODE_STATUS_201;
        ctx.body = createContact;
      }
    } else {
      const createContact = await salesforceCliente.create(clientVtex, adrress.data[0], accessToken);
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
