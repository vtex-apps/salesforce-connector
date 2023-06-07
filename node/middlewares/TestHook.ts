import SalesforceClient from "../clients/salesforceClient";
import SalesforceProduct from "../products/SalesforceProduct";
import { CODE_STATUS_200, CODE_STATUS_500 } from "../utils/constans";

export async function TestHook(ctx: Context, next: () => Promise<any>) {
  console.log(ctx.body);

  try {
    const salesforceClient = new SalesforceClient();
    const accessToken = await salesforceClient.auth();
    const salesforceProduct = new SalesforceProduct();
    console.log('accessToken', accessToken.data);
    console.log('salesforceProduct', salesforceProduct);
    ctx.status = CODE_STATUS_200;
  } catch (error) {
    console.error('error', error)
    ctx.status = CODE_STATUS_500;
    ctx.body = error;
  }

  await next();
}
