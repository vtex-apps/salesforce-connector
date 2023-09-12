import type { AxiosInstance } from 'axios'

import type { AbandonedCartResponse } from '../schemas/AbandonedCartResponse'
import type { Item } from '../schemas/orderVtexResponse'
import type { ParameterList } from '../schemas/Parameter'
import { Result } from '../schemas/Result'
import {
  ACCOUNT_ID,
  CODE_STATUS_200,
  CODE_STATUS_201,
  LIST_PRICE_ID,
  PATH_API_SALESFORCE,
  PATH_ASSOCIATE_OPPORTUNITY_PRODUCT_SALESFORCE,
  PATH_OPPORTUNITY_SALESFORCE,
} from '../utils/constans'

export default class SalesforceOpportunityService {
  public createOpportunity = async (
    request: AbandonedCartResponse,
    parameterList: ParameterList,
    userSalesforceId: string,
    http: AxiosInstance
  ) => {
    const fullDate = new Date(request.rclastsessiondate)
    const date = `${fullDate.getFullYear()}-${
      fullDate.getMonth() + 1
    }-${fullDate.getDate()}`

    const accountId = parameterList.get(ACCOUNT_ID)
    const listPriceId = parameterList.get(LIST_PRICE_ID)
    const body = {
      Name: request.carttag,
      Description: `Abandoned cart -> ${request.carttag}}`,
      StageName: 'Abandoned Cart',
      CloseDate: date,
      Amount: request.rclastcartvalue,
      Pricebook2Id: listPriceId,
      AccountId: accountId,
      OwnerId: userSalesforceId,
    }

    const url = `${PATH_API_SALESFORCE}${PATH_OPPORTUNITY_SALESFORCE}`

    try {
      const { data, status } = await http.post(url, body)

      if (status === CODE_STATUS_200 || status === CODE_STATUS_201) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(
        status,
        'Opportunity could not be created in salesforce',
        data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'An error occurred when creating opportunity in salesforce',
        error
      )
    }
  }

  public associateOpportunityAndProduct = async (
    opportunityId: string,
    pricebookEntryId: string,
    item: Item,
    http: AxiosInstance
  ): Promise<Result> => {
    const body = {
      OpportunityId: opportunityId,
      PricebookEntryId: pricebookEntryId,
      quantity: item.quantity,
      unitPrice: item.price / 100,
    }

    const url = `${PATH_API_SALESFORCE}${PATH_ASSOCIATE_OPPORTUNITY_PRODUCT_SALESFORCE}`

    try {
      const { data, status } = await http.post(url, body)

      if (status === CODE_STATUS_200 || status === CODE_STATUS_201) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(
        status,
        'OpportunityLineItem could not be created in salesforce',
        data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'An error occurred when creating OpportunityLineItem in salesforce',
        error
      )
    }
  }
}
