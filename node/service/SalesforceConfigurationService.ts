import { Result } from "../schemas/Result";
import { getHttpToken } from "../utils/HttpUtil";
import { CODE_STATUS_200, CODE_STATUS_201, PATH_ACCOUNT_SALESFORCE, PATH_API_SALESFORCE, PATH_PRICEBOOK2_SALESFORCE, URI_SALESFORCE } from "../utils/constans";

export default class SalesforceConfigurationService {
  public createPricebook = async (accessToken: string) => {
    const http = await getHttpToken(accessToken);
    const newPricebook = {
      Name: "Lista de Precio VTEX",
      Description: "Lista de Precio VTEX",
      IsActive: true
    }
    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_PRICEBOOK2_SALESFORCE}`;
    try {
      const { data, status } = await http.post(url, newPricebook);
      if (status == CODE_STATUS_200 || status == CODE_STATUS_201) {
        return Result.TaskOk(data);
      } else {
        return Result.TaskResult(status, "Pricebook could not be created in salesforce", data);
      }
    }
    catch (error) {
      return Result.TaskResult(500, "An error occurred when creating pricebook in salesforce", error)
    }
  }

  public createAccount = async (access_token: string) : Promise<Result> => {
    const http = await getHttpToken(access_token);
    const newAccount = {
      Name: "VTEX Account",
      Industry: "VTEX",
      Phone: "545455484",
      Website: "www.test.myvtex.com"
    };

    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_ACCOUNT_SALESFORCE}`;
    try {
        const { data, status} = await http.post(url, newAccount);
        if( status == CODE_STATUS_200 || status == CODE_STATUS_201){
          return Result.TaskOk(data);
        }else{
          return Result.TaskResult(status, "Account could not be created in salesforce", data);
        }
    } catch (error) {
        return Result.TaskResult(500, "An error occurred when creating account in salesforce", error)
    }
  }
}
