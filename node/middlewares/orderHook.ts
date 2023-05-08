//import axios from 'axios'

export async function OrderHook(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  const {
    clients: { omsClient , masterDataClient },
  } = ctx

  const { id } = params

 const { data } = await omsClient.getOrder(id+"")
  console.log(data.clientProfileData);

  const clients = await masterDataClient.getClient(data.clientProfileData.userProfileId)

  console.log(clients.data);

  const adrress = await masterDataClient.getAddresses(clients.data[0].id);
  console.log(adrress.data);

  ctx.status = 200;
  ctx.body = "";
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS,POST,GET,PUT,DELETE,PATCH');
  await next();
}
