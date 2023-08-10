import { json } from "co-body";
import { CLIENT_ID, CLIENT_SECRET, CODE_STATUS_201, CODE_STATUS_500, PASSWORD, USERNAME } from "../utils/constans";
import { getHttpVTX } from "../utils/HttpUtil";
import MasterDataService from "../service/MasterDataService";
import { Parameter } from "../schemas/Parameter";

export async function authenticationHook(ctx: Context, next: () => Promise<any>) {
  const {
    req,
  } = ctx

  try {
    // console.log('req', req);
    // const clientId = '3MVG9gtDqcOkH4PKx5GaxzwrPnOsL886NZvqUj3hQddpkMGoEXP_KVm.Sg0tW8l34hWD1amdP3Hl_X9EbLZE1';
    // const clientSecret = '4BF9EA8BC9EA6CAA2CE2505E50BE695F7802AF4414CCE2E048D7356492E279FB';
    // const redirectUri = 'https://login.salesforce.com/services/oauth2/success';

    // ctx.redirect(`https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`);
    const args = await json(req);
    const httpVTX = await getHttpVTX(ctx.vtex.authToken);
    const masterDataService = new MasterDataService();
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
