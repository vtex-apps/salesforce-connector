import OpportunityService from '../../service/OpportunityService'
import type { AbandonedCartResponse } from '../../schemas/AbandonedCartResponse'
import type { Parameter } from '../../schemas/Parameter'
import { ParameterList } from '../../schemas/Parameter'
import { LIST_PRICE_ID } from '../../utils/constans'
import type { Item } from '../../schemas/orderVtexResponse'
import { Result } from '../../schemas/Result'

let mockSalesforceOrderService: any
let mockSalesforceOpportunityService: any
let mockMasterDataService: any
let mockSalesforceClient: any

jest.mock('../../service/SalesforceOrderService', () =>
  jest.fn().mockImplementation(() => mockSalesforceOrderService)
)

jest.mock('../../service/SalesforceOpportunityService', () =>
  jest.fn().mockImplementation(() => mockSalesforceOpportunityService)
)

jest.mock('../../service/masterDataService', () =>
  jest.fn().mockImplementation(() => mockMasterDataService)
)
jest.mock('../../service/SalesforceClientService', () =>
  jest.fn().mockImplementation(() => mockSalesforceClient)
)

describe('OpportunityService', () => {
  let service: OpportunityService
  let opportunity: AbandonedCartResponse
  let parameterList: ParameterList

  beforeEach(() => {
    service = new OpportunityService()
    const item: Item = {
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

    opportunity = {
      email: 'email',
      carttag: 'carttag',
      rclastsessiondate: 'rclastsessiondate',
      items: [item],
    }
    const parameterListPrice = {
      id: LIST_PRICE_ID,
      parameterValue: 'LIST_PRICE_ID',
    }

    const parameters: Parameter[] = []

    parameters.push(parameterListPrice)
    parameterList = new ParameterList(parameters)
  })
  describe('processOpporunity', () => {
    test('create opportunity in Salesforce', async () => {
      mockSalesforceOrderService = {
        getProductByExternalId: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ records: [] })),
        createProduct: jest.fn().mockResolvedValue(Result.TaskOk({ id: 'id' })),
        createPricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ id: 'id' })),
      }

      mockSalesforceOpportunityService = {
        associateOpportunityAndProduct: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({})),
      }

      mockMasterDataService = {
        saveUpdatePriceBookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({})),
      }

      mockSalesforceClient = {
        login: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ access_token: 'token' })),
      }

      const response = await service.processOpporunity(
        opportunity,
        '',
        parameterList,
        '',
        ''
      )

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: '',
      })
    })

    test('Failure to list price id in MTDT', async () => {
      parameterList.remove(LIST_PRICE_ID)
      const response = await service.processOpporunity(
        opportunity,
        '',
        parameterList,
        '',
        ''
      )

      expect(response).toEqual({
        status: 500,
        message: 'Parameter not found: STANDARD_PRICEBOOK_ID',
        data: undefined,
      })
    })

    test('Failure to get product by external id in Salesforce', async () => {
      mockSalesforceOrderService = {
        getProductByExternalId: jest
          .fn()
          .mockResolvedValue(Result.TaskError('error')),
      }
      const response = await service.processOpporunity(
        opportunity,
        '',
        parameterList,
        '',
        ''
      )

      expect(response).toEqual({
        status: 500,
        message: 'error',
        data: undefined,
      })
    })

    test('Failure to create product in Salesforce', async () => {
      mockSalesforceOrderService = {
        getProductByExternalId: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ records: [] })),
        createProduct: jest.fn().mockResolvedValue(Result.TaskError('error')),
      }
      const response = await service.processOpporunity(
        opportunity,
        '',
        parameterList,
        '',
        ''
      )

      expect(response).toEqual({
        status: 500,
        message: 'error',
        data: undefined,
      })
    })

    test('Failure to create pricebookentry in Salesforce', async () => {
      mockSalesforceOrderService = {
        getProductByExternalId: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ records: [] })),
        createProduct: jest.fn().mockResolvedValue(Result.TaskOk({ id: 'id' })),
        createPricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskError('error')),
      }
      const response = await service.processOpporunity(
        opportunity,
        '',
        parameterList,
        '',
        ''
      )

      expect(response).toEqual({
        status: 500,
        message: 'error',
        data: undefined,
      })
    })

    test('Failure to associate opportunity and product in Salesforce', async () => {
      mockSalesforceOrderService = {
        getProductByExternalId: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ records: [] })),
        createProduct: jest.fn().mockResolvedValue(Result.TaskOk({ id: 'id' })),
        createPricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ id: 'id' })),
      }

      mockSalesforceOpportunityService = {
        associateOpportunityAndProduct: jest
          .fn()
          .mockResolvedValue(Result.TaskError('error')),
      }

      mockMasterDataService = {
        saveUpdatePriceBookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({})),
      }
      const response = await service.processOpporunity(
        opportunity,
        '',
        parameterList,
        '',
        ''
      )

      expect(response).toEqual({
        status: 500,
        message: 'error',
        data: undefined,
      })
    })

    test('Flow when a product exists in Salesforce', async () => {
      mockSalesforceOrderService = {
        getProductByExternalId: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ records: [{ Id: 'id' }] })),
        updateUnitPricePricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ id: 'id' })),
      }
      mockMasterDataService = {
        getPriceBookEntry: jest
          .fn()
          .mockResolvedValue(
            Result.TaskOk([{ priceBookEntryId: 'priceBookEntryId' }])
          ),
        updateUnitPricePricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ id: 'id' })),
      }
      const response = await service.processOpporunity(
        opportunity,
        '',
        parameterList,
        '',
        ''
      )

      expect(response).toEqual({
        status: 500,
        message: 'error',
        data: undefined,
      })
    })

    test('Failure to get pricebookentry in MTDT', async () => {
      mockSalesforceOrderService = {
        getProductByExternalId: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ records: [{ Id: 'id' }] })),
        updateUnitPricePricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ id: 'id' })),
        createPricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ id: 'id' })),
      }

      mockMasterDataService = {
        getPriceBookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskError('error')),
        saveUpdatePriceBookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({})),
      }
      const response = await service.processOpporunity(
        opportunity,
        '',
        parameterList,
        '',
        ''
      )

      expect(response).toEqual({
        status: 500,
        message: 'error',
        data: undefined,
      })
    })

    test('Failure to create pricebookentry in Salesforce', async () => {
      mockSalesforceOrderService = {
        getProductByExternalId: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ records: [{ Id: 'id' }] })),
        updateUnitPricePricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({ id: 'id' })),
        createPricebookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskError('error')),
      }

      mockMasterDataService = {
        getPriceBookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskError('error')),
        saveUpdatePriceBookEntry: jest
          .fn()
          .mockResolvedValue(Result.TaskOk({})),
      }
      const response = await service.processOpporunity(
        opportunity,
        '',
        parameterList,
        '',
        ''
      )

      expect(response).toEqual({
        status: 500,
        message: 'error',
        data: undefined,
      })
    })

    test('Error to create opportunity in Salesforce', async () => {
      mockSalesforceOrderService = {
        getProductByExternalId: jest
          .fn()
          .mockRejectedValue(Result.TaskError('error')),
      }
      const response = await service.processOpporunity(
        opportunity,
        '',
        parameterList,
        '',
        ''
      )

      expect(response).toEqual({
        status: 500,
        message: 'an error occurred while processing the completed order',
        data: Result.TaskResult(500, 'error', undefined),
      })
    })
  })
})
