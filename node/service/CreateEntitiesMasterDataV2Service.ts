import { AxiosInstance } from "axios";
import { Result } from "../schemas/Result";
import { CODE_STATUS_200, CODE_STATUS_201, CODE_STATUS_204, CODE_STATUS_500 } from "../utils/constans";

export default class CreateEntitiesMasterDataV2Service {
  public createEntity = async (ctx: Context, http: AxiosInstance): Promise<Result> => {
    try {
      const request = [
        {
          "dataEntityName": "Parameter",
          "schemaName": "parameterSchema",
          "body": {
            "properties": {
              "idParameter": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "groupName": {
                "type": "string"
              },
              "parameterValue": {
                "type": "string"
              },
            }
          }
        },
        {
          "dataEntityName": "OrderSalesforce",
          "schemaName": "orderSalesforceSchema",
          "body": {
            "properties": {
              "idSfc": {
                "type": "string"
              },
              "statusOrder": {
                "type": "string"
              },
              "updateDate": {
                "type": "string"
              },
            }
          }
        },
        {
          "dataEntityName": "PricebookEntry",
          "schemaName": "pricebookEntrySchema",
          "body": {
            "properties": {
              "priceBookEntryId": {
                "type": "string"
              },
              "productId": {
                "type": "string"
              }
            }
          }
        },
      ]
      request.forEach(async (element) => {
        const response = await http.put(`http://${ctx.vtex.account}.myvtex.com/api/dataentities/${element.dataEntityName}/schemas/${element.schemaName}`, element.body);
        if (response.status == CODE_STATUS_200 || response.status == CODE_STATUS_201 || response.status == CODE_STATUS_204) {
          console.log(`Entity ${element.dataEntityName} registered in MTDT`);
        } else {
          console.log(`The ${element.dataEntityName} was already created in MTDT and had no modifications`);
        }
      });
      return Result.TaskOk("Entities registered in MTDT");
    } catch (error) {
      return Result.TaskResult(CODE_STATUS_500, "An error has occurred in createEntity", error)
    }
  }
}
