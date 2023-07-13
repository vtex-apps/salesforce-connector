import { Result } from "../schemas/Result";
import { getHttpToken, getSoapToken } from "../utils/HttpUtil";
import { CODE_STATUS_200, CODE_STATUS_201, PATH_ACCOUNT_SALESFORCE, PATH_API_SALESFORCE, PATH_CUSTOMFIELD_SALESFORCE, PATH_FIELDS_ORDER_SALESFORCE, PATH_PRICEBOOK2_SALESFORCE, URI_SALESFORCE } from "../utils/constans";

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

  public createAccount = async (access_token: string): Promise<Result> => {
    const http = await getHttpToken(access_token);
    const newAccount = {
      Name: "VTEX Account",
      Industry: "VTEX",
      Phone: "545455484",
      Website: "www.test.myvtex.com"
    };

    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_ACCOUNT_SALESFORCE}`;
    try {
      const { data, status } = await http.post(url, newAccount);
      if (status == CODE_STATUS_200 || status == CODE_STATUS_201) {
        return Result.TaskOk(data);
      } else {
        return Result.TaskResult(status, "Account could not be created in salesforce", data);
      }
    } catch (error) {
      return Result.TaskResult(500, "An error occurred when creating account in salesforce", error)
    }
  }

  public createCustomField = async (access_token: string): Promise<Result> => {
    const http = await getSoapToken(access_token);
    const newCustomField = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Header>
          <h:SessionHeader xmlns:h="http://soap.sforce.com/2006/04/metadata" 
            xmlns="http://soap.sforce.com/2006/04/metadata" 
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
            xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <sessionId>${access_token}</sessionId>
          </h:SessionHeader>
        </s:Header>
        <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema">
          <createMetadata xmlns="http://soap.sforce.com/2006/04/metadata">
            <metadata xsi:type="CustomField">
              <fullName>Order.Order_Status__c</fullName>
              <label>Order Status</label>
              <type>Text</type>
              <length>50</length>
              <required>true</required>
            </metadata>
          </createMetadata>
        </s:Body>
      </s:Envelope>
    `

    const url = `${URI_SALESFORCE}${PATH_CUSTOMFIELD_SALESFORCE}`;
    try {
      const { data, status } = await http.post(url, newCustomField);
      if (status == CODE_STATUS_200 || status == CODE_STATUS_201) {
        return Result.TaskOk(data);
      } else {
        return Result.TaskResult(status, "Custom field could not be created in salesforce", data);
      }
    } catch (error) {
      return Result.TaskResult(500, "An error occurred when creating Custom field in salesforce", error)
    }
  }

  public getFielsOrder = async (access_token: string): Promise<Result> => {
    const http = await getHttpToken(access_token);

    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_FIELDS_ORDER_SALESFORCE}`;
    try {
      const { data, status } = await http.get(url);
      if( status == CODE_STATUS_200){
        return Result.TaskOk(data);
      }else{
        return Result.TaskResult(status, "Order fields could not be queried in salesforce", data);
      }
    } catch (error) {
        return Result.TaskResult(500, "an error occurred while viewing the Order fields", error)
    }
  }
}
