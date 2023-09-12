import type { AbandonedCartResponse } from '../schemas/AbandonedCartResponse'
import type { PriceBookEntryOrderSalesforce } from '../schemas/OrderSalesforce'
import type { ParameterList } from '../schemas/Parameter'
import { Result } from '../schemas/Result'
import { getHttpToken, getHttpVTX } from '../utils/HttpUtil'
import { LIST_PRICE_ID } from '../utils/constans'
import MasterDataService from './MasterDataService'
import SalesforceOpportunityService from './SalesforceOpportunityService'
import SalesforceOrderService from './SalesforceOrderService'

export default class OpportunityService {
  public processOpporunity = async (
    opportunity: AbandonedCartResponse,
    opportunityId: string,
    parameterList: ParameterList,
    authToken: string,
    accountVtex: string
  ): Promise<Result> => {
    try {
      const httpVTX = await getHttpVTX(authToken)
      const salesforceOrderService = new SalesforceOrderService()
      const masterDataService = new MasterDataService()
      const salesforceOpportunity = new SalesforceOpportunityService()
      const listPriceId = parameterList.get(LIST_PRICE_ID)
      const http = await getHttpToken(parameterList)

      if (listPriceId === undefined) {
        return Result.TaskError(`Parameter not found: ${LIST_PRICE_ID}`)
      }

      opportunity.items.forEach(async (item) => {
        const resultGetProduct = await salesforceOrderService.getProductByExternalId(
          item.id,
          http
        )

        if (!resultGetProduct.isOk()) {
          return Result.TaskError(resultGetProduct.message)
        }

        const itemsFound = resultGetProduct.data

        if (itemsFound.records.length === 0) {
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
          // create relation opportunity-product
          const resultCreateOpportunityItem = await salesforceOpportunity.associateOpportunityAndProduct(
            opportunityId,
            pricebookEntry.priceBookEntryId,
            item,
            http
          )

          if (!resultCreateOpportunityItem.isOk()) {
            return Result.TaskError(resultCreateOpportunityItem.message)
          }
        } else {
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

          // create relation opportunity-product
          const resultCreateOpportunityItem = await salesforceOpportunity.associateOpportunityAndProduct(
            opportunityId,
            priceBookEntryId,
            item,
            http
          )

          if (!resultCreateOpportunityItem.isOk()) {
            return Result.TaskError(resultCreateOpportunityItem.message)
          }
        }
      })

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
