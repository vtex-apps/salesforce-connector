import { CODE_STATUS_200 } from "../utils/constans";

export async function createTrigger(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterDataClient },
  } = ctx

  const response = await masterDataClient.createTrigger();
  ctx.status = CODE_STATUS_200;
  ctx.body = response

  await next();
}
