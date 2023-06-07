import SalesforceClient from "../clients/salesforceClient"
import SalesforceProduct from "../products/SalesforceProduct";
import { Item } from "../schemas/orderVtexResponse";
import { CODE_STATUS_200, CODE_STATUS_201, CODE_STATUS_500 } from "../utils/constans"

export async function orderState(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const {
    clients: { omsClient, masterDataClient },
  } = ctx

  try {
    const { orderId } = ctx.body;
    const order = await omsClient.getOrder(orderId);
    const userProfileId = order.clientProfileData.userProfileId;
    const clientVtex = await masterDataClient.getClient(userProfileId, 'V1');
    const address = await masterDataClient.getAddresses(clientVtex.id, 'V1');
    const salesforceCliente = new SalesforceClient();
    const accessToken = await salesforceCliente.auth();
    const clientSalesforce = await salesforceCliente.get(clientVtex, accessToken.data);
    if (clientSalesforce.data.records.length !== 0 && clientVtex.email === clientSalesforce.data.records[0].Email) {
      const updateContact = await salesforceCliente.update(clientVtex, address, clientSalesforce.data.records[0].Id, accessToken.data);
      ctx.state = CODE_STATUS_200;
      ctx.body = updateContact.data;
    } else {
      const createContact = await salesforceCliente.create(clientVtex, address, accessToken.data);
      ctx.state = CODE_STATUS_201;
      ctx.body = createContact.data;
    }
    const salesforceProduct = new SalesforceProduct();
    const createOportunity = await salesforceProduct.createOportunity(order, accessToken.data);
    console.log(createOportunity.data);
    order.items.forEach(async (item: Item) => {
      const product = await salesforceProduct.getProduct(item, accessToken.data);
      console.log(product.data);
      if (product.data.totalSize === 0) {
        const createProduct = await salesforceProduct.createProduct(item, accessToken.data);
        console.log(createProduct.data);
      }
    });
  } catch (error) {
    console.error('error', error)
    ctx.state = CODE_STATUS_500
    ctx.body = error
  }

  await next()
}
