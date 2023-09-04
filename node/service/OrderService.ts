import {
  OrderSalesforce,
  PriceBookEntryOrderSalesforce,
} from '../schemas/OrderSalesforce'
import { OrderVtexResponse } from '../schemas/orderVtexResponse'
import { ParameterList } from '../schemas/Parameter'
import { Result } from '../schemas/Result'
import SalesforceOrderService from './SalesforceOrderService'
import { LIST_PRICE_ID } from '../utils/constans'
import { getHttpToken, getHttpVTX } from '../utils/HttpUtil'
import { StatusOrder } from '../utils/StatusOrder'
import { getCurrentDate } from '../utils/Util'
import MasterDataService from './MasterDataService'

export default class OrderService {
  public processOrder = async (
    order: OrderVtexResponse,
    clientSalesforceId: string,
    access_token: string,
    parameter: ParameterList,
    authToken: string,
    accountVtex: string
  ): Promise<Result> => {
    try {
      const httpVTX = await getHttpVTX(authToken)
      const salesforceOrderService = new SalesforceOrderService()
      const masterDataService = new MasterDataService()
      const listPriceId = parameter.get(LIST_PRICE_ID)
      const http = await getHttpToken(access_token)
      if (listPriceId === undefined) {
        return Result.TaskError(`Parameter not found: ${LIST_PRICE_ID}`)
      }
      //Order created in salesforce
      const resultOrder = await salesforceOrderService.createOrder(
        order,
        clientSalesforceId,
        http,
        parameter
      )
      if (!resultOrder.isOk()) {
        console.log(resultOrder.message)
        console.log(resultOrder.data)
        return Result.TaskError(resultOrder.message)
      }
      //save order in master data entity
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
        console.log(resultSave.message)
        console.log(resultSave.data)
        return Result.TaskError(resultSave.message)
      }
      for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i]
        const resultGetProduct = await salesforceOrderService.getProductByExternalId(
          item.id,
          http
        )
        if (!resultGetProduct.isOk()) {
          console.log(resultGetProduct.message)
          console.log(resultGetProduct.data)
          return Result.TaskError(resultGetProduct.message)
        }
        const itemsFound = resultGetProduct.data
        if (itemsFound.records.length === 0) {
          // Product not exists
          console.log('Product Not Found')
          //create product
          const resultCreateProduct = await salesforceOrderService.createProduct(
            item,
            http
          )
          if (!resultCreateProduct.isOk()) {
            console.log(resultCreateProduct.message)
            console.log(resultCreateProduct.data)
            return Result.TaskError(resultCreateProduct.message)
          }
          const idProduct = resultCreateProduct.data.id
          //create priceBook entry
          const resultCreatePricebookEntry = await salesforceOrderService.createPricebookEntry(
            idProduct,
            listPriceId,
            item,
            http
          )
          if (!resultCreatePricebookEntry.isOk()) {
            console.log(resultCreatePricebookEntry.message)
            console.log(resultCreatePricebookEntry.data)
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
          //create relation order-product
          const resultCreateOrderItem = await salesforceOrderService.associateOrderAndProduct(
            orderSF.idSfc,
            pricebookEntry.priceBookEntryId,
            item,
            http
          )
          if (!resultCreateOrderItem.isOk()) {
            console.log(resultCreateOrderItem.message)
            console.log(resultCreateOrderItem.data)
            return Result.TaskError(resultCreateOrderItem.message)
          }
        } else {
          // product found
          console.log('Product Found')
          const idProduct = itemsFound.records[0].Id
          console.log(idProduct)
          let priceBookEntryId = ''
          const resultPriceBookEntry = await masterDataService.getPriceBookEntry(
            idProduct,
            accountVtex,
            httpVTX
          )
          console.log(resultPriceBookEntry.data)
          if (resultPriceBookEntry.isOk()) {
            // PriceBookEntryFound
            const data: PriceBookEntryOrderSalesforce =
              resultPriceBookEntry.data[0]
            priceBookEntryId = data.priceBookEntryId
            await salesforceOrderService.updateUnitPricePricebookEntry(
              priceBookEntryId,
              item,
              http
            )
          } else {
            //create priceBook entry
            const resultCreatePricebookEntry = await salesforceOrderService.createPricebookEntry(
              idProduct,
              listPriceId,
              item,
              http
            )
            if (!resultCreatePricebookEntry.isOk()) {
              console.log(resultCreatePricebookEntry.message)
              console.log(resultCreatePricebookEntry.data)
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
          //create relation order-product
          const resultCreateOrderItem = await salesforceOrderService.associateOrderAndProduct(
            orderSF.idSfc,
            priceBookEntryId,
            item,
            http
          )
          if (!resultCreateOrderItem.isOk()) {
            console.log(resultCreateOrderItem.message)
            console.log(resultCreateOrderItem.data)
            return Result.TaskError(resultCreateOrderItem.message)
          }
        }
      }
      return Result.TaskOk('')
    } catch (error) {
      console.log(error)
      return Result.TaskResult(
        500,
        'an error occurred while processing the completed order',
        error
      )
    }
  }
}
