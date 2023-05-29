import { CODE_STATUS_200 } from "../utils/constans";

export async function CreateTrigger(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterDataClient },
  } = ctx

  const response = await masterDataClient.createTrigger();
  //TODO: Handle error response
  ctx.status = CODE_STATUS_200;
  ctx.body = response

  await next();
}
