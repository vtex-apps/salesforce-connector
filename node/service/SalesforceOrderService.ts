import type { AxiosInstance } from 'axios'

import { Result } from '../schemas/Result'
import type {
  Item,
  OrderVtexResponse,
  PriceTag,
  RatesAndBenefitsData,
} from '../schemas/orderVtexResponse'
import type { ParameterList } from '../schemas/Parameter'
import {
  ACCOUNT_ID,
  CODE_STATUS_200,
  CODE_STATUS_201,
  LIST_PRICE_ID,
  PATH_API_SALESFORCE,
  PATH_ASSOCIATE_ORDER_PRODUCT_SALESFORCE,
  PATH_ORDER_SALESFORCE,
  PATH_PRICEBOOKENTRY_SALESFORCE,
  PATH_PRODUCT2_SALESFORCE,
  PATH_QUERY_SALESFORCE,
} from '../utils/constans'
import { StatusOrderSalesForce } from '../utils/StatusOrder'

export default class SalesforceOrderService {
  public createOrder = async (
    order: OrderVtexResponse,
    clientSalesforceId: string,
    http: AxiosInstance,
    parameterList: ParameterList
  ): Promise<Result> => {
    const fullDate = new Date(order.creationDate)
    const date = `${fullDate.getFullYear()}-${
      fullDate.getMonth() + 1
    }-${fullDate.getDate()}`

    const accountId = parameterList.get(ACCOUNT_ID)

    if (accountId === undefined) {
      return Result.TaskError(`Parameter not found: ${ACCOUNT_ID}`)
    }

    const listPriceId = parameterList.get(LIST_PRICE_ID)

    if (listPriceId === undefined) {
      return Result.TaskError(`Parameter not found: ${LIST_PRICE_ID}`)
    }

    let promotions = ''

    order.ratesAndBenefitsData.forEach(
      async (rate: RatesAndBenefitsData, i) => {
        if (i !== order.ratesAndBenefitsData.length - 1) {
          promotions += `${rate.name}\n`
        } else {
          promotions += `${rate.name}`
        }
      }
    )

    const body = {
      Description: `Order VTEX #${order.orderId}`,
      Status: StatusOrderSalesForce.DRAFT,
      Order_Status__c: order.status,
      Payment_Method__c: order.paymentSystemName,
      Discounts__c: order.discounts,
      Promotions__c: promotions || 'Sin promociones',
      Created_By__c: clientSalesforceId,
      Shipping_Type__c: order.shippingType,
      PoDate: date,
      EffectiveDate: date,
      PoNumber: order.orderId,
      OrderReferenceNumber: order.sequence,
      ShipToContactId: clientSalesforceId,
      ShippingStreet: order.address.street,
      ShippingCity: order.address.city,
      ShippingState: order.address.state,
      ShippingCountry: order.address.country,
      ShippingPostalCode: order.address.postalCode,
      AccountId: accountId,
      Pricebook2Id: listPriceId,
    }

    const url = `${PATH_API_SALESFORCE}${PATH_ORDER_SALESFORCE}`

    try {
      const { data, status } = await http.post(url, body)

      if (status === CODE_STATUS_200 || status === CODE_STATUS_201) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(
        status,
        'order could not be created in salesforce',
        data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'an error occurred while processing order',
        error
      )
    }
  }

  public getProductByExternalId = async (
    itemId: string,
    http: AxiosInstance
  ): Promise<Result> => {
    const url = `${PATH_QUERY_SALESFORCE}SELECT Id, Name FROM Product2 WHERE ExternalId = '${itemId}'`

    try {
      const { data, status } = await http.get(url)

      if (status === CODE_STATUS_200) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(
        status,
        'product could not be queried in salesforce',
        data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'an error occurred while viewing the product',
        error
      )
    }
  }

  public createProduct = async (
    item: Item,
    http: AxiosInstance
  ): Promise<Result> => {
    const body = {
      Name: item.name,
      Description: item.name,
      ExternalId: item.id,
      ProductCode: item.productId,
      QuantityUnitOfMeasure: item.measurementUnit,
      DisplayUrl: item.imageUrl,
      IsActive: true,
    }

    const url = `${PATH_API_SALESFORCE}${PATH_PRODUCT2_SALESFORCE}`

    try {
      const { data, status } = await http.post(url, body)

      if (status === CODE_STATUS_200 || status === CODE_STATUS_201) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(
        status,
        'product could not be created in salesforce',
        data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'an error occurred when creating product in salesforce',
        error
      )
    }
  }

  public createPricebookEntry = async (
    productId: string,
    priceBookId: string,
    item: Item,
    http: AxiosInstance
  ): Promise<Result> => {
    const body = {
      Product2Id: productId,
      Pricebook2Id: priceBookId,
      UnitPrice: item.sellingPrice / 100,
    }

    const url = `${PATH_API_SALESFORCE}${PATH_PRICEBOOKENTRY_SALESFORCE}`

    try {
      const { data, status } = await http.post(url, body)

      if (status === CODE_STATUS_200 || status === CODE_STATUS_201) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(
        status,
        'PricebookEntry could not be created in salesforce',
        data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'an error occurred when creating PricebookEntry in salesforce',
        error
      )
    }
  }

  public associateOrderAndProduct = async (
    order: OrderVtexResponse,
    orderId: string,
    pricebookEntryId: string,
    item: Item,
    http: AxiosInstance
  ): Promise<Result> => {
    let pomotions = ''

    item.priceTags.forEach((priceTag: PriceTag, i) => {
      const promotion = order.ratesAndBenefitsData.find(
        (rate) => rate.id === priceTag.identifier
      )

      if (i !== item.priceTags.length - 1) {
        pomotions += `${promotion?.name}: ${priceTag.value}, `
      } else {
        pomotions += `${promotion?.name}: ${priceTag.value}`
      }
    })

    const body = {
      OrderId: orderId,
      PricebookEntryId: pricebookEntryId,
      quantity: item.quantity,
      unitPrice: item.sellingPrice / 100,
      Price_List__c: item.price / 100,
      Description: pomotions,
    }

    const url = `${PATH_API_SALESFORCE}${PATH_ASSOCIATE_ORDER_PRODUCT_SALESFORCE}`

    try {
      const { data, status } = await http.post(url, body)

      if (status === CODE_STATUS_200 || status === CODE_STATUS_201) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(
        status,
        'OrderItem could not be created in salesforce',
        data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'an error occurred when creating OrderItem in salesforce',
        error
      )
    }
  }

  public updateUnitPricePricebookEntry = async (
    pricebookEntryId: string,
    item: Item,
    http: AxiosInstance
  ): Promise<Result> => {
    const body = {
      UnitPrice: item.sellingPrice / 100,
    }

    const url = `${PATH_API_SALESFORCE}${PATH_PRICEBOOKENTRY_SALESFORCE}/${pricebookEntryId}`

    try {
      const { data, status } = await http.patch(url, body)

      if (status === CODE_STATUS_200 || status === CODE_STATUS_201) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(
        status,
        'PricebookEntry could not be updating in salesforce',
        data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'an error occurred when updating PricebookEntry in salesforce',
        error
      )
    }
  }

  public getOrderById = async (
    orderId: string,
    http: AxiosInstance
  ): Promise<Result> => {
    const url = `${PATH_QUERY_SALESFORCE}SELECT Id, Name FROM Order WHERE PoNumber = '${orderId}'`

    try {
      const { data, status } = await http.get(url)

      if (status === CODE_STATUS_200) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(
        status,
        'order could not be queried in salesforce',
        data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'an error occurred while viewing the order',
        error
      )
    }
  }

  public updateStatusOrder = async (
    orderId: string,
    currentState: string,
    http: AxiosInstance
  ): Promise<Result> => {
    const body = {
      Order_Status__c: currentState,
    }

    const url = `${PATH_API_SALESFORCE}${PATH_ORDER_SALESFORCE}/${orderId}`

    try {
      const { data, status } = await http.patch(url, body)

      if (status === CODE_STATUS_200 || status === CODE_STATUS_201) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(
        status,
        'updateStatusOrder could not be updating in salesforce',
        data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'an error occurred when updating updateStatusOrder in salesforce',
        error
      )
    }
  }
}
