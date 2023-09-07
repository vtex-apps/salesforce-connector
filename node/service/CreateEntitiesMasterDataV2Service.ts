import { AxiosInstance } from 'axios'
import { Result } from '../schemas/Result'
import {
  CODE_STATUS_200,
  CODE_STATUS_201,
  CODE_STATUS_204,
  CODE_STATUS_500,
  ENTITY_ORDER_V2,
  ENTITY_PARAMETER_V2,
  ENTITY_PRICEBOOKENTRY_V2,
} from '../utils/constans'

export default class CreateEntitiesMasterDataV2Service {
  public createEntity = async (
    accountVtex: string,
    http: AxiosInstance
  ): Promise<Result> => {
    try {
      const request = [
        {
          dataEntityName: ENTITY_PARAMETER_V2,
          schemaName: 'parameterSchema',
          body: {
            properties: {
              description: {
                type: 'string',
              },
              groupName: {
                type: 'string',
              },
              parameterValue: {
                type: 'string',
              },
            },
          },
        },
        {
          dataEntityName: ENTITY_ORDER_V2,
          schemaName: 'orderSalesforceSchema',
          body: {
            properties: {
              idSfc: {
                type: 'string',
              },
              statusOrder: {
                type: 'string',
              },
              updateDate: {
                type: 'string',
              },
            },
          },
        },
        {
          dataEntityName: ENTITY_PRICEBOOKENTRY_V2,
          schemaName: 'pricebookEntrySchema',
          body: {
            properties: {
              priceBookEntryId: {
                type: 'string',
              },
            },
          },
        },
      ]
      request.forEach(async (element) => {
        const response = await http.put(
          `http://${accountVtex}.myvtex.com/api/dataentities/${element.dataEntityName}/schemas/${element.schemaName}`,
          element.body
        )
        if (
          response.status === CODE_STATUS_200 ||
          response.status === CODE_STATUS_201 ||
          response.status === CODE_STATUS_204
        ) {
          Result.TaskOk(`Entity ${element.dataEntityName} registered in MTDT`)
        } else {
          Result.TaskResult(
            response.status,
            `The ${element.dataEntityName} was already created in MTDT and had no modifications`,
            response.data
          )
        }
      })
      return Result.TaskOk('Entities registered in MTDT')
    } catch (error) {
      return Result.TaskResult(
        CODE_STATUS_500,
        'An error has occurred in createEntity',
        error
      )
    }
  }
}
