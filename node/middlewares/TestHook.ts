import SalesforceClient from "../clients/salesforceClient";
import SalesforceProduct from "../products/SalesforceProduct";
import { json } from "co-body";
import { CODE_STATUS_200, CODE_STATUS_500 } from "../utils/constans";
import { Item } from "../schemas/orderVtexResponse";

export async function TestHook(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterDataClient },
    req,
  } = ctx

  try {
    const args = await json(req);
    const userProfileId = args.clientProfileData.userProfileId;
    const clientVtex = await masterDataClient.getClient(userProfileId, 'V1');
    const salesforceClient = new SalesforceClient();
    const accessToken = await salesforceClient.auth();
    const clientSalesforce = await salesforceClient.get(clientVtex, accessToken.data);
    const { Id } = clientSalesforce.data.records[0];
    const salesforceProduct = new SalesforceProduct();
    const createOrder = await salesforceProduct.createOrder(args, Id, accessToken.data);
    args.items.forEach(async (item: Item) => {
      const product = await salesforceProduct.getProduct(item, accessToken.data);
      if (product.data.totalSize === 0) {
        const createProduct = await salesforceProduct.createProduct(item, accessToken.data);
        console.log('product -> ', createProduct.data);
        const createPricebookEntry = await salesforceProduct.createPricebookEntry(createProduct.data.id, accessToken.data);
        console.log('pribookentry -> ', createPricebookEntry.data);
        const associateOrderAndProduct = await salesforceProduct.associateOrderAndProduct(
          createOrder.data.id, createPricebookEntry.data.id, item, accessToken.data);
        console.log(associateOrderAndProduct.data);
      } else {
        const associateOrderAndProduct = await salesforceProduct.associateOrderAndProduct(
          createOrder.data.id, product.data.records[0].Id, item, accessToken.data);
        console.log(associateOrderAndProduct.data);
      }
    });
    ctx.status = CODE_STATUS_200;
  } catch (error) {
    console.error('error', error)
    ctx.status = CODE_STATUS_500;
    ctx.body = error;
  }

  await next();
}
