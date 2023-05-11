import SalesforceClient from "../clients/salesforceClient"

export async function orderState(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const {
    clients: { omsClient, masterDataClient },
  } = ctx

  try {
    const { orderId } = ctx.body
    const order = await omsClient.getOrder(orderId)
    const { userProfileId } = order.data.clientProfileData
    const clientVtex = await masterDataClient.getClient(userProfileId)
    const adrress = await masterDataClient.getAddresses(clientVtex.data[0].id);
    const salesforceCliente = new SalesforceClient();
    const accessToken = await salesforceCliente.auth(ctx);
    const clientSalesforce = await salesforceCliente.get(clientVtex, accessToken);
    if (clientSalesforce.records.length !== 0) {
      if (clientVtex.data[0].email === clientSalesforce.records[0].Email) {
        const updateContact = await salesforceCliente.update(clientVtex, adrress.data[0], clientSalesforce.records[0].Id, accessToken);
        console.log(updateContact);
      } else {
        const createContact = await salesforceCliente.create(clientVtex, adrress.data[0], accessToken);
        console.log(createContact);
      }
    } else {
      const createContact = await salesforceCliente.create(clientVtex, adrress.data[0], accessToken);
      console.log(createContact);
    }
  } catch (error) {
    console.info('error', error)
    ctx.state = 500
    ctx.body = error
  }

  await next()
}
