export const queries = {
  getData: async (_: unknown, { orderId }: any, ctx: Context): Promise<any> => {
    return ctx.clients.masterDataClient.getClient(orderId, 'V1')
  },
}
