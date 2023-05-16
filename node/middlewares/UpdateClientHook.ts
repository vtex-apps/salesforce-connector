import { json } from "co-body";
import SalesforceClient from "../clients/salesforceClient";

export async function UpdateClientHook(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterDataClient },
    req,
  } = ctx
  
  try {
    const args = await json(req);
    const clientVtex = await masterDataClient.getClient(args.userId)
    const adrress = await masterDataClient.getAddresses(clientVtex.data[0].id);
    const salesforceCliente = new SalesforceClient();
    const accessToken = await salesforceCliente.auth();
    const clientSalesforce = await salesforceCliente.get(clientVtex, accessToken);
    if (clientSalesforce.records.length !== 0) {
      if (clientVtex.data[0].email === clientSalesforce.records[0].Email) {
        const updateContact = await salesforceCliente.update(clientVtex, adrress.data[0], clientSalesforce.records[0].Id, accessToken);
        ctx.status = 200;
        ctx.body = updateContact;
      } else {
        const createContact = await salesforceCliente.create(clientVtex, adrress.data[0], accessToken);
        ctx.status = 201;
        ctx.body = createContact;
      }
    } else {
      const createContact = await salesforceCliente.create(clientVtex, adrress.data[0], accessToken);
      ctx.status = 201;
      ctx.body = createContact;
    }
  } catch (error) {
    console.info('error', error)
    ctx.status = 500
    ctx.body = error
  }

  await next();
}
