import type { AxiosInstance } from 'axios'

import type {
  OrderSalesforce,
  PriceBookEntryOrderSalesforce,
} from '../schemas/OrderSalesforce'
import { Result } from '../schemas/Result'
import {
  CODE_STATUS_200,
  CODE_STATUS_201,
  CODE_STATUS_204,
  ENTITY_ORDER_V2,
  ENTITY_PARAMETER_V2,
  ENTITY_PRICEBOOKENTRY_V2,
} from '../utils/constans'
import { validateResponse } from '../utils/Util'
import type { Parameter } from '../schemas/Parameter'

export default class MasterDataService {
  public saveUpdateOrder = async (
    order: OrderSalesforce,
    accountVtex: string,
    http: AxiosInstance
  ): Promise<Result> => {
    try {
      const response = await http.put(
        `http://${accountVtex}.myvtex.com/api/dataentities/${ENTITY_ORDER_V2}/documents`,
        order
      )

      if (
        response.status === CODE_STATUS_200 ||
        response.status === CODE_STATUS_201 ||
        response.status === CODE_STATUS_204
      ) {
        return Result.TaskOk(response.data)
      }

      return Result.TaskResult(
        response.status,
        'could not be registered Order in MTDT',
        response.data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'an error has occurred  in saveUpdateOrder',
        error
      )
    }
  }

  public saveUpdateParameter = async (
    parameter: Parameter,
    account: string,
    http: AxiosInstance
  ): Promise<Result> => {
    try {
      const response = await http.put(
        `http://${account}.myvtex.com/api/dataentities/${ENTITY_PARAMETER_V2}/documents`,
        parameter
      )

      if (
        response.status === CODE_STATUS_200 ||
        response.status === CODE_STATUS_201 ||
        response.status === CODE_STATUS_204
      ) {
        return Result.TaskOk(response.data)
      }

      return Result.TaskResult(
        response.status,
        'could not be registered Parameters in MTDT',
        response.data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'an error has occurred  in saveParameters',
        error
      )
    }
  }

  public saveUpdatePriceBookEntry = async (
    pricebookEntry: PriceBookEntryOrderSalesforce,
    account: string,
    http: AxiosInstance
  ): Promise<Result> => {
    try {
      const response = await http.put(
        `http://${account}.myvtex.com/api/dataentities/${ENTITY_PRICEBOOKENTRY_V2}/documents`,
        pricebookEntry
      )

      if (
        response.status === CODE_STATUS_200 ||
        response.status === CODE_STATUS_201 ||
        response.status === CODE_STATUS_204
      ) {
        return Result.TaskOk(response.data)
      }

      return Result.TaskResult(
        response.status,
        'could not be registered PriceBookEntry in MTDT',
        response.data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'an error has occurred  in saveUpdatePriceBookEntry',
        error
      )
    }
  }

  public getParameters = async (
    account: string,
    http: AxiosInstance
  ): Promise<Result> => {
    try {
      const { data, status } = await http.get(
        `http://${account}.myvtex.com/api/dataentities/${ENTITY_PARAMETER_V2}/search?_fields=id,parameterValue`
      )

      if (status === 200 && validateResponse(data)) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(
        status,
        'could not be get Parameters in MTDT',
        data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'an error has occurred  in getParameters',
        error
      )
    }
  }

  public getPriceBookEntry = async (
    productId: string,
    account: string,
    http: AxiosInstance
  ): Promise<Result> => {
    try {
      const { data, status } = await http.get(
        `http://${account}.myvtex.com/api/dataentities/${ENTITY_PRICEBOOKENTRY_V2}/search?_fields=_all&_where=id=${productId}`
      )

      if (status === 200 && validateResponse(data)) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(404, 'not found PriceBookEntry in MTDT', data)
    } catch (error) {
      return Result.TaskResult(
        500,
        'an error has occurred  in PriceBookEntry',
        error
      )
    }
  }

  public getSku = async (
    skuId: string,
    account: string,
    http: AxiosInstance
  ): Promise<Result> => {
    try {
      const { data, status } = await http.get(
        `http://${account}.myvtex.com/api/catalog/pvt/stockkeepingunit/${skuId}`
      )

      if (status === 200) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(404, 'not found Sku in MTDT', data)
    } catch (error) {
      return Result.TaskResult(500, 'an error has occurred in Sku', error)
    }
  }

  public getProduct = async (
    productId: number,
    account: string,
    http: AxiosInstance
  ): Promise<Result> => {
    try {
      const { data, status } = await http.get(
        `http://${account}.myvtex.com/api/catalog/pvt/product/${productId}`
      )

      if (status === 200) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(404, 'not found Product in MTDT', data)
    } catch (error) {
      return Result.TaskResult(500, 'an error has occurred in Product', error)
    }
  }
}
