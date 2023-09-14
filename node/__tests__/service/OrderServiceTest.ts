import type { OrderVtexResponse } from '../../schemas/orderVtexResponse'
import type { Parameter } from '../../schemas/Parameter'
import { ParameterList } from '../../schemas/Parameter'
import { Result } from '../../schemas/Result'
import OrderService from '../../service/OrderService'
import { ACCOUNT_ID, LIST_PRICE_ID } from '../../utils/constans'

let mockSalesforceOrderService: any
let mockMasterDataService: any

jest.mock('../../service/SalesforceOrderService', () =>
  jest.fn().mockImplementation(() => mockSalesforceOrderService)
)
jest.mock('../../service/MasterDataService', () =>
  jest.fn().mockImplementation(() => mockMasterDataService)
)

describe('OrderService', () => {
  let service: OrderService
  let order: OrderVtexResponse
  let parameterList: ParameterList

  beforeEach(() => {
    service = new OrderService()
    order = {
      orderId: 'orderId',
      sequence: '0',
      status: 'status',
      value: 0,
      creationDate: 'creationDate',
      items: [
        {
          id: 'id',
          productId: 'productId',
          uniqueId: 'uniqueId',
          name: 'name',
          quantity: 0,
          measurementUnit: 'measurementUnit',
          price: 0,
          imageUrl: 'imageUrl',
          refId: 'refId',
          sellingPrice: 0,
        },
      ],
      clientProfileData: {
        id: 'id',
        firtsName: 'firtsName',
        lastName: 'lastName',
        document: 'document',
        phone: 'phone',
        userProfileId: 'userProfileId',
      },
      address: {
        street: 'street',
        city: 'city',
        state: 'state',
        country: 'country',
        postalCode: 'postalCode',
      },
    }
    const paremeterAccount = {
      id: ACCOUNT_ID,
      parameterValue: 'ACCOUNT_ID',
    }

    const parameterListPrice = {
      id: LIST_PRICE_ID,
      parameterValue: 'LIST_PRICE_ID',
    }

    const parameters: Parameter[] = []

    parameters.push(paremeterAccount)
    parameters.push(parameterListPrice)
    parameterList = new ParameterList(parameters)
  })
  describe('processOrder', () => {
    test('create order in Salesforce', async () => {
      mockSalesforceOrderService = {
        createOrder: jest.fn().mockResolvedValue(Result.TaskOk({ id: 'id' })),
        getProductByExternalId: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ records: [] })),
        createProduct: jest.fn().mockResolvedValue(Result.TaskOk({ id: 'id' })),
        createPricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ id: 'id' })),
        associateOrderAndProduct: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({})),
      }
      mockMasterDataService = {
        saveUpdateOrder: jest.fn().mockResolvedValue(Result.TaskOk({})),
        saveUpdatePriceBookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({})),
      }
      const response = await service.processOrder(
        order,
        'clientSalesforceId',
        parameterList,
        'authToken',
        'accountVtex'
      )

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: '',
      })
    })

    test('Failure to list price id in MTDT', async () => {
      parameterList.remove(LIST_PRICE_ID)
      const response = await service.processOrder(
        order,
        'clientSalesforceId',
        parameterList,
        'authToken',
        'accountVtex'
      )

      expect(response).toEqual({
        status: 500,
        message: 'Parameter not found: STANDARD_PRICEBOOK_ID',
        data: undefined,
      })
    })

    test('Failure to create order in Salesforce', async () => {
      mockSalesforceOrderService = {
        createOrder: jest.fn().mockResolvedValue(Result.TaskError('error')),
      }
      const response = await service.processOrder(
        order,
        'clientSalesforceId',
        parameterList,
        'authToken',
        'accountVtex'
      )

      expect(response).toEqual({
        status: 500,
        message: 'error',
        data: undefined,
      })
    })

    test('Failure to save or update order in MTDT', async () => {
      mockSalesforceOrderService = {
        createOrder: jest.fn().mockResolvedValue(Result.TaskOk({ id: 'id' })),
      }
      mockMasterDataService = {
        saveUpdateOrder: jest.fn().mockResolvedValue(Result.TaskError('error')),
      }
      const response = await service.processOrder(
        order,
        'clientSalesforceId',
        parameterList,
        'authToken',
        'accountVtex'
      )

      expect(response).toEqual({
        status: 500,
        message: 'error',
        data: undefined,
      })
    })

    test('Failure to get product by external id in Salesforce', async () => {
      mockSalesforceOrderService = {
        createOrder: jest.fn().mockResolvedValue(Result.TaskOk({ id: 'id' })),
        getProductByExternalId: jest
          .fn()
          .mockResolvedValue(Result.TaskError('error')),
      }
      mockMasterDataService = {
        saveUpdateOrder: jest.fn().mockResolvedValue(Result.TaskOk({})),
      }
      const response = await service.processOrder(
        order,
        'clientSalesforceId',
        parameterList,
        'authToken',
        'accountVtex'
      )

      expect(response).toEqual({
        status: 500,
        message: 'error',
        data: undefined,
      })
    })

    test('Failure to create product in Salesforce', async () => {
      mockSalesforceOrderService = {
        createOrder: jest.fn().mockResolvedValue(Result.TaskOk({ id: 'id' })),
        getProductByExternalId: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ records: [] })),
        createProduct: jest.fn().mockResolvedValue(Result.TaskError('error')),
      }
      mockMasterDataService = {
        saveUpdateOrder: jest.fn().mockResolvedValue(Result.TaskOk({})),
      }
      const response = await service.processOrder(
        order,
        'clientSalesforceId',
        parameterList,
        'authToken',
        'accountVtex'
      )

      expect(response).toEqual({
        status: 500,
        message: 'error',
        data: undefined,
      })
    })

    test('Failure to create pricebookentry in Salesforce', async () => {
      mockSalesforceOrderService = {
        createOrder: jest.fn().mockResolvedValue(Result.TaskOk({ id: 'id' })),
        getProductByExternalId: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ records: [] })),
        createProduct: jest.fn().mockResolvedValue(Result.TaskOk({ id: 'id' })),
        createPricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskError('error')),
      }
      mockMasterDataService = {
        saveUpdateOrder: jest.fn().mockResolvedValue(Result.TaskOk({})),
      }
      const response = await service.processOrder(
        order,
        'clientSalesforceId',
        parameterList,
        'authToken',
        'accountVtex'
      )

      expect(response).toEqual({
        status: 500,
        message: 'error',
        data: undefined,
      })
    })

    test('Failure to associate order and product in Salesforce', async () => {
      mockSalesforceOrderService = {
        createOrder: jest.fn().mockResolvedValue(Result.TaskOk({ id: 'id' })),
        getProductByExternalId: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ records: [] })),
        createProduct: jest.fn().mockResolvedValue(Result.TaskOk({ id: 'id' })),
        createPricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ id: 'id' })),
        associateOrderAndProduct: jest
          .fn()
          .mockResolvedValue(Result.TaskError('error')),
      }
      mockMasterDataService = {
        saveUpdateOrder: jest.fn().mockResolvedValue(Result.TaskOk({})),
        saveUpdatePriceBookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({})),
      }
      const response = await service.processOrder(
        order,
        'clientSalesforceId',
        parameterList,
        'authToken',
        'accountVtex'
      )

      expect(response).toEqual({
        status: 500,
        message: 'error',
        data: undefined,
      })
    })

    test('Flow when a product exists in Salesforce', async () => {
      mockSalesforceOrderService = {
        createOrder: jest.fn().mockResolvedValue(Result.TaskOk({ id: 'id' })),
        getProductByExternalId: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ records: [{ Id: 'id' }] })),
        updateUnitPricePricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ id: 'id' })),
        associateOrderAndProduct: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({})),
      }
      mockMasterDataService = {
        saveUpdateOrder: jest.fn().mockResolvedValue(Result.TaskOk({})),
        getPriceBookEntry: jest
          .fn()
          .mockResolvedValue(
            Result.TaskOk([{ id: 'id', priceBookEntryId: 'priceBookEntryId' }])
          ),
      }
      const response = await service.processOrder(
        order,
        'clientSalesforceId',
        parameterList,
        'authToken',
        'accountVtex'
      )

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: '',
      })
    })

    test('Flow when a pricebookentry not exists in MTDT', async () => {
      mockSalesforceOrderService = {
        createOrder: jest.fn().mockResolvedValue(Result.TaskOk({ id: 'id' })),
        getProductByExternalId: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ records: [{ Id: 'id' }] })),
        updateUnitPricePricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ id: 'id' })),
        createPricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskError('error')),
        associateOrderAndProduct: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({})),
      }
      mockMasterDataService = {
        saveUpdateOrder: jest.fn().mockResolvedValue(Result.TaskOk({})),
        getPriceBookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskError('error')),
        saveUpdatePriceBookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({})),
      }
      const response = await service.processOrder(
        order,
        'clientSalesforceId',
        parameterList,
        'authToken',
        'accountVtex'
      )

      expect(response).toEqual({
        status: 500,
        message: 'error',
        data: undefined,
      })
    })

    test('Failure to associate order and product in Salesforce', async () => {
      mockSalesforceOrderService = {
        createOrder: jest.fn().mockResolvedValue(Result.TaskOk({ id: 'id' })),
        getProductByExternalId: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ records: [{ Id: 'id' }] })),
        updateUnitPricePricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ id: 'id' })),
        createPricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ id: 'id' })),
        associateOrderAndProduct: jest
          .fn()
          .mockResolvedValue(Result.TaskError('error')),
      }
      mockMasterDataService = {
        saveUpdateOrder: jest.fn().mockResolvedValue(Result.TaskOk({})),
        getPriceBookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskError('error')),
        saveUpdatePriceBookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({})),
      }
      const response = await service.processOrder(
        order,
        'clientSalesforceId',
        parameterList,
        'authToken',
        'accountVtex'
      )

      expect(response).toEqual({
        status: 500,
        message: 'error',
        data: undefined,
      })
    })

    test('Error to create order in Salesforce', async () => {
      mockSalesforceOrderService = {
        createOrder: jest.fn().mockRejectedValue(Result.TaskError('error')),
      }
      const response = await service.processOrder(
        order,
        'clientSalesforceId',
        parameterList,
        'authToken',
        'accountVtex'
      )

      expect(response).toEqual({
        status: 500,
        message: 'an error occurred while processing the completed order',
        data: Result.TaskResult(500, 'error', undefined),
      })
    })
  })
})
