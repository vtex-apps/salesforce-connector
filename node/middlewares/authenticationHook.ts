import axios from "axios";
import { ACCESS_TOKEN_SALEFORCE, CLIENT_ID, CLIENT_SECRET, CODE_STATUS_200, CODE_STATUS_500, GRANT_TYPE, PATH_AUTHENTICATION_SALESFORCE, URI_SALESFORCE_AUTH } from "../utils/constans";
import qs from "qs";
import MasterDataService from "../service/MasterDataService";
import { Parameter, ParameterList } from "../schemas/Parameter";
import { getHttpVTX } from "../utils/HttpUtil";

export async function authenticationHook(ctx: Context, next: () => Promise<any>) {
  const {
    url,
  } = ctx
  
  try {
    const params = new URLSearchParams(url.split('?')[1]);
    const code = params.get('code');
    const httpVTX = await getHttpVTX(ctx.vtex.authToken);
    const masterDataService = new MasterDataService();
    const resultParameters = await masterDataService.getParameters(ctx.vtex.account, httpVTX);
    const parameterList = new ParameterList(resultParameters.data);
    const tokenUrl = URI_SALESFORCE_AUTH;
    const tokenParams = {
      grant_type: GRANT_TYPE,
      client_id: parameterList.get(CLIENT_ID),
      client_secret: parameterList.get(CLIENT_SECRET),
      redirect_uri: `https://${ctx.vtex.host}${PATH_AUTHENTICATION_SALESFORCE}`,
      code: code,
    };

    const response = await axios.post(tokenUrl, qs.stringify(tokenParams));
    const accessToken = response.data.access_token;

    const parameterAccountSaleforce: Parameter = {
      id: ACCESS_TOKEN_SALEFORCE,
      parameterValue: accessToken,
      description: "Token de acceso a salesforce",
      groupName: "SALESFORCE",
    }
    await masterDataService.saveUpdateParameter(parameterAccountSaleforce, ctx.vtex.account, httpVTX);

    ctx.status = CODE_STATUS_200;
    ctx.body = "Proceso de autenticación exitoso";
  } catch (error) {
    console.error('error', error)
    ctx.status = CODE_STATUS_500
    ctx.body = error
  }

  await next();
}
