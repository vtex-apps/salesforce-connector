import CreateEntitiesMasterDataV2Service from "../service/CreateEntitiesMasterDataV2Service";
import { getHttpVTX } from "../utils/HttpUtil";
import { CODE_STATUS_200, CODE_STATUS_500 } from "../utils/constans";

export async function createEntitiesMasterDataV2Hook(ctx: Context, next: () => Promise<any>) {
  try {
    const httpVTX = await getHttpVTX(ctx.vtex.authToken);
    const createEntitiesMasterDataV2Service = new CreateEntitiesMasterDataV2Service();
    const response = await createEntitiesMasterDataV2Service.createEntity(ctx, httpVTX);
    ctx.status = CODE_STATUS_200;
    ctx.body = response;
  } catch (error) {
    ctx.status = CODE_STATUS_500;
    ctx.body = error.response.data;
  }

  await next();
}
