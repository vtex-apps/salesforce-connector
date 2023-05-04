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
    const { email } = order.data.clientProfileData
    const client = await masterDataClient.getClient(email)

    console.log(client)
  } catch (error) {
    console.info('error', error)
    ctx.state = 500
    ctx.body = error
  }

  await next()
}
