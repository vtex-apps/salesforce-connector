import type {
  OrderSalesforce,
  PriceBookEntryOrderSalesforce,
} from '../schemas/OrderSalesforce'
import type { OrderVtexResponse } from '../schemas/orderVtexResponse'
import type { ParameterList } from '../schemas/Parameter'
import { Result } from '../schemas/Result'
import SalesforceOrderService from './SalesforceOrderService'
import { LIST_PRICE_ID } from '../utils/constans'
import { getHttpToken, getHttpVTX } from '../utils/HttpUtil'
import { StatusOrder } from '../utils/StatusOrder'
import { getCurrentDate } from '../utils/Util'
import MasterDataService from './MasterDataService'
import SalesforceClient from './SalesforceClientService'

export default class OrderService {
  public processOrder = async (
    order: OrderVtexResponse,
    clientSalesforceId: string,
    parameterList: ParameterList,
    authToken: string,
    accountVtex: string
  ): Promise<Result> => {
    try {
      const httpVTX = await getHttpVTX(authToken)
      const salesforceOrderService = new SalesforceOrderService()
      const masterDataService = new MasterDataService()
      const listPriceId = parameterList.get(LIST_PRICE_ID)
      const salesforceClientService = new SalesforceClient()
      const resultLogin = await salesforceClientService.login(parameterList)
      const http = await getHttpToken(
        parameterList,
        resultLogin.data.access_token
      )

      if (listPriceId === undefined) {
        return Result.TaskError(`Parameter not found: ${LIST_PRICE_ID}`)
      }

      // Order created in salesforce
      const resultOrder = await salesforceOrderService.createOrder(
        order,
        clientSalesforceId,
        http,
        parameterList
      )

      if (!resultOrder.isOk()) {
        return Result.TaskError(resultOrder.message)
      }

      // save order in master data entity
      const orderSF: OrderSalesforce = {
        id: order.orderId,
        idSfc: resultOrder.data.id,
        statusOrder: StatusOrder.SYNCH,
        updateDate: getCurrentDate(),
      }

      const resultSave = await masterDataService.saveUpdateOrder(
        orderSF,
        accountVtex,
        httpVTX
      )

      if (!resultSave.isOk()) {
        return Result.TaskError(resultSave.message)
      }

      for (const item of order.items) {
        const resultGetProduct = await salesforceOrderService.getProductByExternalId(
          item.id,
          http
        )

        if (!resultGetProduct.isOk()) {
          return Result.TaskError(resultGetProduct.message)
        }

        const itemsFound = resultGetProduct.data

        if (itemsFound.records.length === 0) {
          // Product not exists
          // create product
          const resultCreateProduct = await salesforceOrderService.createProduct(
            item,
            http
          )

          if (!resultCreateProduct.isOk()) {
            return Result.TaskError(resultCreateProduct.message)
          }

          const idProduct = resultCreateProduct.data.id
          // create priceBook entry
          const resultCreatePricebookEntry = await salesforceOrderService.createPricebookEntry(
            idProduct,
            listPriceId,
            item,
            http
          )

          if (!resultCreatePricebookEntry.isOk()) {
            return Result.TaskError(resultCreatePricebookEntry.message)
          }

          const pricebookEntry: PriceBookEntryOrderSalesforce = {
            id: idProduct,
            priceBookEntryId: resultCreatePricebookEntry.data.id,
          }

          await masterDataService.saveUpdatePriceBookEntry(
            pricebookEntry,
            accountVtex,
            httpVTX
          )
          // create relation order-product
          const resultCreateOrderItem = await salesforceOrderService.associateOrderAndProduct(
            orderSF.idSfc,
            pricebookEntry.priceBookEntryId,
            item,
            http
          )

          if (!resultCreateOrderItem.isOk()) {
            return Result.TaskError(resultCreateOrderItem.message)
          }
        } else {
          // product found
          const idProduct = itemsFound.records[0].Id
          let priceBookEntryId = ''
          const resultPriceBookEntry = await masterDataService.getPriceBookEntry(
            idProduct,
            accountVtex,
            httpVTX
          )

          if (resultPriceBookEntry.isOk()) {
            // PriceBookEntryFound
            const data: PriceBookEntryOrderSalesforce = {
              ...resultPriceBookEntry.data[0],
            }

            priceBookEntryId = data.priceBookEntryId
            await salesforceOrderService.updateUnitPricePricebookEntry(
              priceBookEntryId,
              item,
              http
            )
          } else {
            // create priceBook entry
            const resultCreatePricebookEntry = await salesforceOrderService.createPricebookEntry(
              idProduct,
              listPriceId,
              item,
              http
            )

            if (!resultCreatePricebookEntry.isOk()) {
              return Result.TaskError(resultCreatePricebookEntry.message)
            }

            const pricebookEntry: PriceBookEntryOrderSalesforce = {
              id: idProduct,
              priceBookEntryId: resultCreatePricebookEntry.data.id,
            }

            priceBookEntryId = pricebookEntry.priceBookEntryId
            await masterDataService.saveUpdatePriceBookEntry(
              pricebookEntry,
              accountVtex,
              httpVTX
            )
          }

          // create relation order-product
          const resultCreateOrderItem = await salesforceOrderService.associateOrderAndProduct(
            orderSF.idSfc,
            priceBookEntryId,
            item,
            http
          )

          if (!resultCreateOrderItem.isOk()) {
            return Result.TaskError(resultCreateOrderItem.message)
          }
        }
      }

      return Result.TaskOk('')
    } catch (error) {
      return Result.TaskResult(
        500,
        'an error occurred while processing the completed order',
        error
      )
    }
  }
}
