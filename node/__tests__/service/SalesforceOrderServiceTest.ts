import type { AxiosInstance } from 'axios'
import axios from 'axios'

import SalesforceOrderService from '../../service/SalesforceOrderService'
import type { Item, OrderVtexResponse } from '../../schemas/orderVtexResponse'
import type { Parameter } from '../../schemas/Parameter'
import { ParameterList } from '../../schemas/Parameter'
import { ACCOUNT_ID, LIST_PRICE_ID } from '../../utils/constans'

describe('SalesforceOrderService', () => {
  let service: SalesforceOrderService
  let mockAxiosInstance: AxiosInstance
  let order: OrderVtexResponse
  let parameterList: ParameterList
  let item: Item

  beforeEach(() => {
    service = new SalesforceOrderService()
    mockAxiosInstance = axios.create()
    order = {
      orderId: '',
      sequence: '',
      status: '',
      value: 0,
      discounts: 0,
      ratesAndBenefitsData: [
        {
          name: 'promo 1',
        },
        {
          name: 'promo 2',
        },
      ],
      creationDate: '',
      paymentSystemName: '',
      items: [],
      clientProfileData: {
        id: '',
        firtsName: '',
        lastName: '',
        document: '',
        phone: '',
        userProfileId: '',
      },
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      },
    }
    const parameterAccount: Parameter = {
      id: ACCOUNT_ID,
      parameterValue: 'ACCOUNT_ID',
    }

    const parameterListPrice = {
      id: LIST_PRICE_ID,
      parameterValue: 'LIST_PRICE_ID',
    }

    const parameters: Parameter[] = []

    parameters.push(parameterAccount)
    parameters.push(parameterListPrice)
    parameterList = new ParameterList(parameters)
    item = {
      id: '',
      productId: '',
      uniqueId: '',
      name: '',
      quantity: 0,
      measurementUnit: '',
      price: 0,
      imageUrl: '',
      refId: '',
      sellingPrice: 0,
    }
  })

  describe('createOrder', () => {
    test('Create order in Saleforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 201 })
      const response = await service.createOrder(
        order,
        '',
        mockAxiosInstance,
        parameterList
      )

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Create order without promotions in Saleforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 201 })
      order.ratesAndBenefitsData = []
      const response = await service.createOrder(
        order,
        '',
        mockAxiosInstance,
        parameterList
      )

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Not found account id in MTDT', async () => {
      parameterList.remove(ACCOUNT_ID)
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 201 })
      const response = await service.createOrder(
        order,
        '',
        mockAxiosInstance,
        parameterList
      )

      expect(response).toEqual({
        status: 500,
        message: `Parameter not found: ${ACCOUNT_ID}`,
        data: undefined,
      })
    })

    test('Not found list price id in MTDT', async () => {
      parameterList.remove(LIST_PRICE_ID)
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 201 })
      const response = await service.createOrder(
        order,
        '',
        mockAxiosInstance,
        parameterList
      )

      expect(response).toEqual({
        status: 500,
        message: `Parameter not found: ${LIST_PRICE_ID}`,
        data: undefined,
      })
    })

    test('Failed to create order in salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 500 })
      const response = await service.createOrder(
        order,
        '',
        mockAxiosInstance,
        parameterList
      )

      expect(response).toEqual({
        status: 500,
        message: 'order could not be created in salesforce',
        data: undefined,
      })
    })

    test('Error to create order in salesforce', async () => {
      jest
        .spyOn(mockAxiosInstance, 'post')
        .mockRejectedValue(new Error('Request failed with status code 400'))
      const response = await service.createOrder(
        order,
        '',
        mockAxiosInstance,
        parameterList
      )

      expect(response).toEqual({
        status: 500,
        message: 'an error occurred while processing order',
        data: new Error('Request failed with status code 400'),
      })
    })
  })

  describe('getProductByExternalId', () => {
    test('Get product by external id in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockResolvedValue({ status: 200 })
      const response = await service.getProductByExternalId(
        '',
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failed to get product by external id in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockResolvedValue({ status: 404 })
      const response = await service.getProductByExternalId(
        '',
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 404,
        message: 'product could not be queried in salesforce',
        data: undefined,
      })
    })

    test('Error to get product by external id in Salesforce', async () => {
      jest
        .spyOn(mockAxiosInstance, 'get')
        .mockRejectedValue(new Error('Request failed with status code 400'))
      const response = await service.getProductByExternalId(
        '',
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 500,
        message: 'an error occurred while viewing the product',
        data: new Error('Request failed with status code 400'),
      })
    })
  })

  describe('createProduct', () => {
    test('Create product in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 201 })
      const response = await service.createProduct(item, mockAxiosInstance)

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failed to create product in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 500 })
      const response = await service.createProduct(item, mockAxiosInstance)

      expect(response).toEqual({
        status: 500,
        message: 'product could not be created in salesforce',
        data: undefined,
      })
    })

    test('Error to create product in Salesforce', async () => {
      jest
        .spyOn(mockAxiosInstance, 'post')
        .mockRejectedValue(new Error('Request failed with status code 400'))
      const response = await service.createProduct(item, mockAxiosInstance)

      expect(response).toEqual({
        status: 500,
        message: 'an error occurred when creating product in salesforce',
        data: new Error('Request failed with status code 400'),
      })
    })
  })

  describe('createPricebookEntry', () => {
    test('Create pricebookEntry in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 201 })
      const response = await service.createPricebookEntry(
        '',
        '',
        item,
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failed to create pricebookEntry in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 500 })
      const response = await service.createPricebookEntry(
        '',
        '',
        item,
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 500,
        message: 'PricebookEntry could not be created in salesforce',
        data: undefined,
      })
    })

    test('Error to create pricebookEntry in Salesforce', async () => {
      jest
        .spyOn(mockAxiosInstance, 'post')
        .mockRejectedValue(new Error('Request failed with status code 400'))
      const response = await service.createPricebookEntry(
        '',
        '',
        item,
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 500,
        message: 'an error occurred when creating PricebookEntry in salesforce',
        data: new Error('Request failed with status code 400'),
      })
    })
  })

  describe('associateOrderAndProduct', () => {
    test('Create associate order and product in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 201 })
      const response = await service.associateOrderAndProduct(
        '',
        '',
        item,
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failed to create associate order and product in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 500 })
      const response = await service.associateOrderAndProduct(
        '',
        '',
        item,
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 500,
        message: 'OrderItem could not be created in salesforce',
        data: undefined,
      })
    })

    test('Error to create associate order and product in Salesforce', async () => {
      jest
        .spyOn(mockAxiosInstance, 'post')
        .mockRejectedValue(new Error('Request failed with status code 400'))
      const response = await service.associateOrderAndProduct(
        '',
        '',
        item,
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 500,
        message: 'an error occurred when creating OrderItem in salesforce',
        data: new Error('Request failed with status code 400'),
      })
    })
  })

  describe('updateUnitPricePricebookEntry', () => {
    test('Update unit price pricebookEntry in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'patch').mockResolvedValue({ status: 200 })
      const response = await service.updateUnitPricePricebookEntry(
        '',
        item,
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failed to update unit price pricebookEntry in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'patch').mockResolvedValue({ status: 500 })
      const response = await service.updateUnitPricePricebookEntry(
        '',
        item,
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 500,
        message: 'PricebookEntry could not be updating in salesforce',
        data: undefined,
      })
    })

    test('Error to update unit price pricebookEntry in Salesforce', async () => {
      jest
        .spyOn(mockAxiosInstance, 'patch')
        .mockRejectedValue(new Error('Request failed with status code 400'))
      const response = await service.updateUnitPricePricebookEntry(
        '',
        item,
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 500,
        message: 'an error occurred when updating PricebookEntry in salesforce',
        data: new Error('Request failed with status code 400'),
      })
    })
  })

  describe('getOrderById', () => {
    test('Get order by id in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockResolvedValue({ status: 200 })
      const response = await service.getOrderById('', mockAxiosInstance)

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failed to get order by id in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockResolvedValue({ status: 404 })
      const response = await service.getOrderById('', mockAxiosInstance)

      expect(response).toEqual({
        status: 404,
        message: 'order could not be queried in salesforce',
        data: undefined,
      })
    })

    test('Error to get order by id in Salesforce', async () => {
      jest
        .spyOn(mockAxiosInstance, 'get')
        .mockRejectedValue(new Error('Request failed with status code 400'))
      const response = await service.getOrderById('', mockAxiosInstance)

      expect(response).toEqual({
        status: 500,
        message: 'an error occurred while viewing the order',
        data: new Error('Request failed with status code 400'),
      })
    })
  })

  describe('updateStatusOrder', () => {
    test('Update status order in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'patch').mockResolvedValue({ status: 200 })
      const response = await service.updateStatusOrder(
        '',
        '',
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failed to update status order in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'patch').mockResolvedValue({ status: 500 })
      const response = await service.updateStatusOrder(
        '',
        '',
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 500,
        message: 'updateStatusOrder could not be updating in salesforce',
        data: undefined,
      })
    })

    test('Error to update status order in Salesforce', async () => {
      jest
        .spyOn(mockAxiosInstance, 'patch')
        .mockRejectedValue(new Error('Request failed with status code 400'))
      const response = await service.updateStatusOrder(
        '',
        '',
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 500,
        message:
          'an error occurred when updating updateStatusOrder in salesforce',
        data: new Error('Request failed with status code 400'),
      })
    })
  })
})
