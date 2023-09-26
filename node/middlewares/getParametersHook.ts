import { ParameterList } from '../schemas/Parameter'
import MasterDataService from '../service/MasterDataService'
import { getHttpVTX } from '../utils/HttpUtil'
import {
  ACCOUNT_SALESFORCE,
  CLIENT_ID,
  CLIENT_SECRET,
  CODE_STATUS_200,
  CODE_STATUS_500,
} from '../utils/constans'

export async function getParametersHook(
  ctx: Context,
  next: () => Promise<any>
) {
  try {
    const httpVTX = await getHttpVTX(ctx.vtex.authToken)
    const masterDataService = new MasterDataService()
    const resultParameters = await masterDataService.getParameters(
      ctx.vtex.account,
      httpVTX
    )

    const parameterList = new ParameterList(resultParameters.data)
    const response = {
      accountSalesforce: parameterList.get(ACCOUNT_SALESFORCE),
      clientId: parameterList.get(CLIENT_ID),
      clientSecret: parameterList.get(CLIENT_SECRET),
    }

    ctx.status = CODE_STATUS_200
    ctx.body = response
  } catch (error) {
    ctx.status = CODE_STATUS_500
    ctx.body = error
  }

  await next()
}
