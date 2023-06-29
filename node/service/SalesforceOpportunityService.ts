import { AbandonedCartResponse } from '../schemas/AbandonedCartResponse';
import { Item } from '../schemas/orderVtexResponse';
import { ParameterList } from '../schemas/Parameter';
import { Result } from '../schemas/Result';
import { ACCOUNT_ID, CODE_STATUS_200, CODE_STATUS_201, LIST_PRICE_ID, PATH_API_SALESFORCE, PATH_ASSOCIATE_OPPORTUNITY_PRODUCT_SALESFORCE, PATH_OPPORTUNITY_SALESFORCE, URI_SALESFORCE } from '../utils/constans';
import { getHttpToken } from '../utils/HttpUtil';

export default class salesforceOpportunityService {
  public createOpportunity = async (request: AbandonedCartResponse, parameters : ParameterList, userSalesforceId: string, accessToken: string) => {
    const http = await getHttpToken(accessToken);
    const fullDate = new Date(request.rclastsessiondate);
    const date = fullDate.getFullYear() + '-' + (fullDate.getMonth() + 1) + '-' + fullDate.getDate();
    const accountId = parameters.get(ACCOUNT_ID);
    const listPriceId = parameters.get(LIST_PRICE_ID);
    const body = {
      Name: request.carttag,
      Description: `Abandoned cart -> ${request.carttag}}`,
      StageName: "Abandoned Cart",
      CloseDate: date,
      Amount: request.rclastcartvalue,
      Pricebook2Id: listPriceId,
      AccountId: accountId,
      OwnerId: userSalesforceId
    }
    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_OPPORTUNITY_SALESFORCE}`;
    try {
      const { data, status } = await http.post(url, body);
      if (status == CODE_STATUS_200 || status == CODE_STATUS_201) {
        return Result.TaskOk(data);
      } else {
        return Result.TaskResult(status, "Opportunity could not be created in salesforce", data);
      }
    }
    catch (error) {
      return Result.TaskResult(500, "An error occurred when creating opportunity in salesforce", error)
    }
  }

  public associateOpportunityAndProduct = async (opportunityId: string, pricebookEntryId: string, item: Item, access_token: string) : Promise<Result> => {
    const http = await getHttpToken(access_token);
    const body = {
      OpportunityId: opportunityId,
      PricebookEntryId: pricebookEntryId,
      quantity: item.quantity,
      unitPrice: item.price / 100
    }

    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_ASSOCIATE_OPPORTUNITY_PRODUCT_SALESFORCE}`;
    try {
        const { data, status} = await http.post(url, body);
        if( status == CODE_STATUS_200 || status == CODE_STATUS_201){
          return Result.TaskOk(data);
        }else{
          return Result.TaskResult(status, "OpportunityLineItem could not be created in salesforce", data);
        }
    } catch (error) {
        return Result.TaskResult(500, "An error occurred when creating OpportunityLineItem in salesforce", error)
    }
  }
}
