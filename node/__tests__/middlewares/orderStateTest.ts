import { orderState } from '../../middlewares/orderState'
import type { Parameter } from '../../schemas/Parameter'
import { Result } from '../../schemas/Result'
import { ACCESS_TOKEN_SALEFORCE } from '../../utils/constans'

let mockMasterDataService: any
let mockSalesforceClient: any
let mockSalesforceOrderService: any

jest.mock('../../service/MasterDataService', () =>
  jest.fn().mockImplementation(() => mockMasterDataService)
)
jest.mock('../../service/SalesforceClientService', () =>
  jest.fn().mockImplementation(() => mockSalesforceClient)
)
jest.mock('../../service/SalesforceOrderService', () =>
  jest.fn().mockImplementation(() => mockSalesforceOrderService)
)

describe('orderState', () => {
  let ctx: any
  const parameters: Parameter[] = []

  beforeEach(() => {
    ctx = {
      vtex: {
        authToken: 'vtexappkey-xxx-xxx-xxx-xxx',
      },
      clients: {
        masterDataClient: {
          getClient: jest.fn().mockResolvedValue({
            id: '123456',
            email: 'email',
          }),
          getAddresses: jest.fn().mockResolvedValue({
            id: '123456',
            addressName: 'addressName',
          }),
        },
        omsClient: {
          getOrder: jest.fn().mockResolvedValue({
            clientProfileData: {
              userProfileId: '123456',
            },
          }),
        },
      },
      body: {
        orderId: '123456',
        currentState: 'payment-pending',
        lastState: 'payment-pending',
      },
    }
    const parameterToken = {
      id: ACCESS_TOKEN_SALEFORCE,
      parameterValue: 'token',
    }

    parameters.push(parameterToken)
  })

  test('Create order in Salesforce', async () => {
    mockMasterDataService = {
      getParameters: jest.fn().mockResolvedValue(Result.TaskOk(parameters)),
    }
    mockSalesforceClient = {
      get: jest.fn().mockResolvedValue({
        data: {
          records: [
            {
              Id: '123456',
              Email: 'email',
            },
          ],
        },
      }),
      update: jest.fn().mockResolvedValue({
        data: {
          id: '123456',
        },
      }),
    }
    mockSalesforceOrderService = {
      getOrderById: jest.fn().mockResolvedValue(
        Result.TaskOk({
          records: [
            {
              Id: '123456',
            },
          ],
        })
      ),
      updateStatusOrder: jest.fn().mockResolvedValue(
        Result.TaskOk({
          status: 200,
          data: {
            id: '123456',
          },
        })
      ),
    }
    const response = await orderState(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })

  test('Create client in Salesforce', async () => {
    mockMasterDataService = {
      getParameters: jest.fn().mockResolvedValue(Result.TaskOk(parameters)),
    }
    mockSalesforceClient = {
      get: jest.fn().mockResolvedValue({
        data: {
          records: [],
        },
      }),
      create: jest.fn().mockResolvedValue({
        data: {
          id: '123456',
        },
      }),
    }
    mockSalesforceOrderService = {
      getOrderById: jest.fn().mockResolvedValue(
        Result.TaskOk({
          records: [
            {
              Id: '123456',
            },
          ],
        })
      ),
      updateStatusOrder: jest.fn().mockResolvedValue(
        Result.TaskOk({
          status: 200,
          data: {
            id: '123456',
          },
        })
      ),
    }
    const response = await orderState(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })

  test('Create order when not found in Salesforce', async () => {
    mockMasterDataService = {
      getParameters: jest.fn().mockResolvedValue(Result.TaskOk(parameters)),
    }
    mockSalesforceClient = {
      get: jest.fn().mockResolvedValue({
        data: {
          records: [],
        },
      }),
      create: jest.fn().mockResolvedValue({
        data: {
          id: '123456',
        },
      }),
    }
    mockSalesforceOrderService = {
      getOrderById: jest.fn().mockResolvedValue(
        Result.TaskOk({
          records: [],
        })
      ),
      updateStatusOrder: jest.fn().mockResolvedValue(
        Result.TaskOk({
          status: 200,
          data: {
            id: '123456',
          },
        })
      ),
    }
    const response = await orderState(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })

  test('Error to create order in Salesforce', async () => {
    mockMasterDataService = {
      getParameters: jest.fn().mockRejectedValue(Result.TaskError('Error')),
    }
    const response = await orderState(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })
})
