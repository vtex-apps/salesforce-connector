import axios from 'axios'

export async function orderState(
  ctx: StatusChangeContext2,
  next: () => Promise<any>
) {
  const {
    clients: { omsClient, masterDataClient },
  } = ctx

  const http=axios.create({
    headers:{
    VtexIdclientAutCookie: ctx.vtex.authToken,
        "Cache-Control":"no-cache",
        "X-Vtex-Use-Https":"true",
    }
  });

  const { data, status } = await http.get(`http://${ctx.vtex.account}.myvtex.com/api/oms/pvt/orders/${ctx.body.orderId}`);
  console.log(data);
  console.log(status);

  try {
    const { orderId } = ctx.body
    const order = await omsClient.getOrder(orderId)
    const { id } = order.data.clientProfileData
    console.log(id)
    const client = await masterDataClient.getClient(id)
    console.log(client)
  } catch (error) {
    console.info('error', error)
    ctx.state = 500
    ctx.body = error
  }

  await next()
}
