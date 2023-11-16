import { getConfigurationHook } from '../../middlewares/getConfigurationHook'
import type { Parameter } from '../../schemas/Parameter'
import { Result } from '../../schemas/Result'
import { ACCOUNT_ID, LIST_PRICE_ID } from '../../utils/constans'

let mockMasterDataService: any
let mockSalesforceConfigurationService: any

jest.mock('../../service/masterDataService', () =>
  jest.fn().mockImplementation(() => mockMasterDataService)
)

jest.mock('../../service/SalesforceConfigurationService', () =>
  jest.fn().mockImplementation(() => mockSalesforceConfigurationService)
)

describe('getConfigurationHook', () => {
  let ctx: any
  const parameters: Parameter[] = []
  const data: any = { fields: [] }

  beforeEach(() => {
    ctx = {
      vtex: {
        authToken: 'vtexappkey-xxx-xxx-xxx-xxx',
      },
    }
    const parameterListPrice = {
      id: LIST_PRICE_ID,
      parameterValue: 'listPriceId',
    }

    const parameterAccountId = {
      id: ACCOUNT_ID,
      parameterValue: 'accountId',
    }

    parameters.push(parameterListPrice)
    parameters.push(parameterAccountId)

    data.fields = [
      {
        name: 'Order_Status__c',
      },
      {
        name: 'Payment_Method__c',
      },
      {
        name: 'Discounts__c',
      },
      {
        name: 'Promotions__c',
      },
      {
        name: 'Order_Status__c',
      },
    ]
  })

  test('Success to get configuration', async () => {
    mockMasterDataService = {
      getParameters: jest.fn().mockResolvedValue(Result.TaskOk(parameters)),
    }

    mockSalesforceConfigurationService = {
      getFielsOrder: jest.fn().mockResolvedValue(Result.TaskOk(data)),
    }

    const response = await getConfigurationHook(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })

  test('Error to get configuration', async () => {
    mockMasterDataService = {
      getParameters: jest.fn().mockRejectedValue(Result.TaskError('error')),
    }
    const response = await getConfigurationHook(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })
})
