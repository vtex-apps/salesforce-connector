import { OrderSalesforce, PriceBookEntryOrderSalesforce } from "../schemas/OrderSalesforce";
import { OrderVtexResponse } from "../schemas/OrderVtexResponse";
import { ParameterList } from "../schemas/Parameter";
import { Result } from "../schemas/Result";
import MasterDataOrderService from "./MasterDataService";
import SalesforceOrderService from "./SalesforceOrderService";
import { LIST_PRICE_ID } from "../utils/constans";
import { getHttpVTX } from "../utils/HttpUtil";
import { StatusOrder } from "../utils/StatusOrder";
import { getCurrentDate } from "../utils/Util";

export default class OrderService {
  public processOrder = async (order: OrderVtexResponse, clientSalesforceId: string, access_token: string, parameter: ParameterList, ctx: StatusChangeContext): Promise<Result> => {
    try {
      const httpVTX = await getHttpVTX(ctx.vtex.authToken);
      const salesforceOrderService = new SalesforceOrderService();
      const masterDataOrderService = new MasterDataOrderService();
      const listPriceId = parameter.get(LIST_PRICE_ID);
      if (listPriceId === undefined) {
        return Result.TaskError(`Parameter not found: ${LIST_PRICE_ID}`)
      }
      //Order created in salesforce
      const resultOrder = await salesforceOrderService.createOrder(order, clientSalesforceId, access_token, parameter);
      if (!resultOrder.isOk()) {
        console.log(resultOrder.message);
        console.log(resultOrder.data);
        return Result.TaskError(resultOrder.message);
      }
      //save order in master data entity
      const orderSF: OrderSalesforce = {
        id: order.orderId,
        idSfc: resultOrder.data.id,
        statusOrder: StatusOrder.SYNCH,
        updateDate: getCurrentDate()
      }
      const resultSave = await masterDataOrderService.saveUpdateOrder(orderSF, ctx, httpVTX);
      if (!resultSave.isOk()) {
        console.log(resultSave.message);
        console.log(resultSave.data);
        return Result.TaskError(resultSave.message);
      }
      for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        const resultGetProduct = await salesforceOrderService.getProductByExternalId(item.id, access_token);
        if (!resultGetProduct.isOk()) {
          console.log(resultGetProduct.message);
          console.log(resultGetProduct.data);
          return Result.TaskError(resultGetProduct.message);
        }
        const itemsFound = resultGetProduct.data;
        if (itemsFound.records.length === 0) { // Product not exists
          console.log('Product Not Found');
          //create product
          const resultCreateProduct = await salesforceOrderService.createProduct(item, access_token);
          if (!resultCreateProduct.isOk()) {
            console.log(resultCreateProduct.message);
            console.log(resultCreateProduct.data);
            return Result.TaskError(resultCreateProduct.message);
          }
          const idProduct = resultCreateProduct.data.id;
          //create priceBook entry
          const resultCreatePricebookEntry = await salesforceOrderService.createPricebookEntry(idProduct, listPriceId, item, access_token);
          if (!resultCreatePricebookEntry.isOk()) {
            console.log(resultCreatePricebookEntry.message);
            console.log(resultCreatePricebookEntry.data);
            return Result.TaskError(resultCreatePricebookEntry.message);
          }
          const pricebookEntry: PriceBookEntryOrderSalesforce = {
            id: idProduct,
            priceBookEntryId: resultCreatePricebookEntry.data.id
          };
          await masterDataOrderService.saveUpdatePriceBookEntry(pricebookEntry, ctx.vtex.account, httpVTX);
          //create relation order-product
          const resultCreateOrderItem = await salesforceOrderService.associateOrderAndProduct(orderSF.idSfc, pricebookEntry.priceBookEntryId, item, access_token);
          if (!resultCreateOrderItem.isOk()) {
            console.log(resultCreateOrderItem.message);
            console.log(resultCreateOrderItem.data);
            return Result.TaskError(resultCreateOrderItem.message);
          }
        } else { // product found
          console.log('Product Found');
          const idProduct = itemsFound.records[0].Id;
          let priceBookEntryId = '';
          const resultPriceBookEntry = await masterDataOrderService.getPriceBookEntry(idProduct, ctx.vtex.account, httpVTX);
          console.log(resultPriceBookEntry);
          if (resultPriceBookEntry.isOk()) { // PriceBookEntryFound
            const data: PriceBookEntryOrderSalesforce = resultPriceBookEntry.data[0];
            priceBookEntryId = data.priceBookEntryId;
            await salesforceOrderService.updateUnitPricePricebookEntry(priceBookEntryId, item, access_token);
          } else {
            //create priceBook entry
            const resultCreatePricebookEntry = await salesforceOrderService.createPricebookEntry(idProduct, listPriceId, item, access_token);
            if (!resultCreatePricebookEntry.isOk()) {
              console.log(resultCreatePricebookEntry.message);
              console.log(resultCreatePricebookEntry.data);
              return Result.TaskError(resultCreatePricebookEntry.message);
            }
            const pricebookEntry: PriceBookEntryOrderSalesforce = {
              id: idProduct,
              priceBookEntryId: resultCreatePricebookEntry.data.id
            };
            priceBookEntryId = pricebookEntry.priceBookEntryId;
            await masterDataOrderService.saveUpdatePriceBookEntry(pricebookEntry, ctx.vtex.account, httpVTX);
          }
          //create relation order-product
          const resultCreateOrderItem = await salesforceOrderService.associateOrderAndProduct(orderSF.idSfc, priceBookEntryId, item, access_token);
          if (!resultCreateOrderItem.isOk()) {
            console.log(resultCreateOrderItem.message);
            console.log(resultCreateOrderItem.data);
            return Result.TaskError(resultCreateOrderItem.message);
          }
        }
      }
      return Result.TaskOk("");
    } catch (error) {
      console.log(error);
      return Result.TaskResult(500, "an error occurred while processing the completed order", error)
    }
  }
}
