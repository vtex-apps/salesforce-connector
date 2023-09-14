import { updateClientHook } from '../../middlewares/UpdateClientHook'
import type { Parameter } from '../../schemas/Parameter'
import { Result } from '../../schemas/Result'
import { ACCESS_TOKEN_SALEFORCE } from '../../utils/constans'

let mockMasterDataService: any
let mockSalesforceClient: any

jest.mock('../../service/MasterDataService', () =>
  jest.fn().mockImplementation(() => mockMasterDataService)
)
jest.mock('../../service/SalesforceClientService', () =>
  jest.fn().mockImplementation(() => mockSalesforceClient)
)

jest.mock('co-body', () => ({
  json: jest.fn().mockReturnValue({ email: 'email' }),
}))

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
      },
      req: {
        version: 'V1',
      },
    }
    const parameterToken = {
      id: ACCESS_TOKEN_SALEFORCE,
      parameterValue: 'token',
    }

    parameters.push(parameterToken)
  })

  test('Update client in Salesforce', async () => {
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
          records: [
            {
              Id: '123456',
              Email: 'email',
            },
          ],
        },
      }),
    }
    const response = await updateClientHook(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })

  test('Create client when not found in Salesforce', async () => {
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
          records: [
            {
              Id: '123456',
              Email: 'email',
            },
          ],
        },
      }),
    }
    const response = await updateClientHook(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })

  test('Error to update client in Salesforce', async () => {
    mockMasterDataService = {
      getParameters: jest.fn().mockRejectedValue(Result.TaskError('error')),
    }
    const response = await updateClientHook(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })
})
