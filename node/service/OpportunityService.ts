import { AbandonedCartResponse } from "../schemas/AbandonedCartResponse";
import { PriceBookEntryOrderSalesforce } from "../schemas/OrderSalesforce";
import { ParameterList } from "../schemas/Parameter";
import { Result } from "../schemas/Result";
import { getHttpVTX } from "../utils/HttpUtil";
import { LIST_PRICE_ID } from "../utils/constans";
import MasterDataService from "./MasterDataService";
import salesforceOpportunityService from "./SalesforceOpportunityService";
import SalesforceOrderService from "./SalesforceOrderService";

export default class OpportunityService {
  public processOpporunity = async (opportunity: AbandonedCartResponse, opportunityId: string, accessToken: string, parameter: ParameterList, ctx: Context): Promise<Result> => {
    try {
      const httpVTX = await getHttpVTX(ctx.vtex.authToken);
      const salesforceOrderService = new SalesforceOrderService();
      const masterDataService = new MasterDataService();
      const salesforceOpportunity = new salesforceOpportunityService();
      const listPriceId = parameter.get(LIST_PRICE_ID);
      if (listPriceId === undefined) {
        return Result.TaskError(`Parameter not found: ${LIST_PRICE_ID}`)
      }
      for (let i = 0; i < opportunity.items.length; i++) {
        const item = opportunity.items[i];
        const resultGetProduct = await salesforceOrderService.getProductByExternalId(item.id, accessToken);
        if (!resultGetProduct.isOk()) {
          console.log(resultGetProduct.message);
          console.log(resultGetProduct.data);
          return Result.TaskError(resultGetProduct.message);
        }
        const itemsFound = resultGetProduct.data;
        if (itemsFound.records.length === 0) {
          const resultCreateProduct = await salesforceOrderService.createProduct(item, accessToken);
          if (!resultCreateProduct.isOk()) {
            console.log(resultCreateProduct.message);
            console.log(resultCreateProduct.data);
            return Result.TaskError(resultCreateProduct.message);
          }
          const idProduct = resultCreateProduct.data.id;
          //create priceBook entry
          const resultCreatePricebookEntry = await salesforceOrderService.createPricebookEntry(idProduct, listPriceId, item, accessToken);
          if (!resultCreatePricebookEntry.isOk()) {
            console.log(resultCreatePricebookEntry.message);
            console.log(resultCreatePricebookEntry.data);
            return Result.TaskError(resultCreatePricebookEntry.message);
          }
          const pricebookEntry: PriceBookEntryOrderSalesforce = {
            id: idProduct,
            priceBookEntryId: resultCreatePricebookEntry.data.id
          };
          await masterDataService.saveUpdatePriceBookEntry(pricebookEntry, ctx.vtex.account, httpVTX);
          //create relation opportunity-product
          const resultCreateOpportunityItem = await salesforceOpportunity.associateOpportunityAndProduct(opportunityId, pricebookEntry.priceBookEntryId, item, accessToken);
          if (!resultCreateOpportunityItem.isOk()) {
            console.log(resultCreateOpportunityItem.message);
            console.log(resultCreateOpportunityItem.data);
            return Result.TaskError(resultCreateOpportunityItem.message);
          }
        } else {
          const idProduct = itemsFound.records[0].Id;
          let priceBookEntryId = '';
          const resultPriceBookEntry = await masterDataService.getPriceBookEntry(idProduct, ctx.vtex.account, httpVTX);
          if (resultPriceBookEntry.isOk()) { // PriceBookEntryFound
            const data: PriceBookEntryOrderSalesforce = resultPriceBookEntry.data[0];
            priceBookEntryId = data.priceBookEntryId;
            await salesforceOrderService.updateUnitPricePricebookEntry(priceBookEntryId, item, accessToken);
          } else {
            //create priceBook entry
            const resultCreatePricebookEntry = await salesforceOrderService.createPricebookEntry(idProduct, listPriceId, item, accessToken);
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
            await masterDataService.saveUpdatePriceBookEntry(pricebookEntry, ctx.vtex.account, httpVTX);
          }
          //create relation opportunity-product
          const resultCreateOpportunityItem = await salesforceOpportunity.associateOpportunityAndProduct(opportunityId, priceBookEntryId, item, accessToken);
          if (!resultCreateOpportunityItem.isOk()) {
            console.log(resultCreateOpportunityItem.message);
            console.log(resultCreateOpportunityItem.data);
            return Result.TaskError(resultCreateOpportunityItem.message);
          }
        }
      };
      return Result.TaskOk("");
    } catch (error) {
      console.log(error);
      return Result.TaskResult(500, "an error occurred while processing the completed order", error)
    }
  }
}
