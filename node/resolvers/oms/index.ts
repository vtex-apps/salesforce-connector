export const queries = {
  getOrder: async (
    _: unknown,
    { orderId }: any,
    ctx: Context
  ): Promise<any> => {
    return ctx.clients.omsClient.getOrder(orderId)
  },
}
