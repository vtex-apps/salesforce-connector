import { json } from "co-body";
import MasterDataOrderService from "../service/MasterDataOrderService";
import { Parameter } from "../schemas/Parameter";
import { getHttpVTX } from "../utils/HttpUtil";
import { CLIENT_ID, CLIENT_SECRET, CODE_STATUS_201, CODE_STATUS_500, PASSWORD, USERNAME } from "../utils/constans";

export async function authenticationHook(ctx: Context, next: () => Promise<any>) {
  const {
    req,
  } = ctx

  try {
    const args = await json(req);
    const httpVTX = await getHttpVTX(ctx.vtex.authToken);
    const masterDataService = new MasterDataOrderService();
    const parameterUserName: Parameter = {
      id: USERNAME,
      parameterValue: args.userName,
      description: "Nombre de usuario de la cuenta de salesforce",
      groupName: "AUTHENTICATION",
    }
    await masterDataService.saveUpdateParameter(parameterUserName, ctx.vtex.account, httpVTX);
    const parameterPassword: Parameter = {
      id: PASSWORD,
      parameterValue: args.password,
      description: "Contraseña de la cuenta de salesforce",
      groupName: "AUTHENTICATION",
    }
    await masterDataService.saveUpdateParameter(parameterPassword, ctx.vtex.account, httpVTX);
    const parameterClientId: Parameter = {
      id: CLIENT_ID,
      parameterValue: args.clientId,
      description: "Client Id de la cuenta de salesforce",
      groupName: "AUTHENTICATION",
    }
    await masterDataService.saveUpdateParameter(parameterClientId, ctx.vtex.account, httpVTX);
    const parameterClientSecret: Parameter = {
      id: CLIENT_SECRET,
      parameterValue: args.clientSecret,
      description: "Client Secret de la cuenta de salesforce",
      groupName: "AUTHENTICATION",
    }
    await masterDataService.saveUpdateParameter(parameterClientSecret, ctx.vtex.account, httpVTX);
    ctx.status = CODE_STATUS_201;
    ctx.body = "Proceso de autenticación exitoso";
  } catch (error) {
    console.error('error', error)
    ctx.status = CODE_STATUS_500
    ctx.body = error
  }

  await next();
}
