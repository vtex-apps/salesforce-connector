import { abandonedCartHook } from '../../middlewares/AbandonedCartHook'
import type { Parameter } from '../../schemas/Parameter'
import { Result } from '../../schemas/Result'
import { ACCESS_TOKEN_SALEFORCE } from '../../utils/constans'

let mockMasterDataService: any
let mockSalesforceClientService: any
let mockSalesforceOpportunityService: any
let mockOpportunityService: any

jest.mock('co-body', () => ({
  json: jest.fn().mockReturnValue({ email: 'email' }),
}))

jest.mock('../../service/masterDataService', () =>
  jest.fn().mockImplementation(() => mockMasterDataService)
)
jest.mock('../../service/SalesforceClientService', () =>
  jest.fn().mockImplementation(() => mockSalesforceClientService)
)
jest.mock('../../service/SalesforceOpportunityService', () =>
  jest.fn().mockImplementation(() => mockSalesforceOpportunityService)
)
jest.mock('../../service/OpportunityService', () =>
  jest.fn().mockImplementation(() => mockOpportunityService)
)

describe('abandonedCartHook', () => {
  let ctx: any
  const parameters: Parameter[] = []

  beforeEach(() => {
    ctx = {
      vtex: {
        authToken: 'vtexappkey-xxx-xxx-xxx-xxx',
      },
      req: {
        email: 'email',
      },
    }
    const parameterToken = {
      id: ACCESS_TOKEN_SALEFORCE,
      parameterValue: 'token',
    }

    parameters.push(parameterToken)
  })

  test('Success execute abandoned cart', async () => {
    mockMasterDataService = {
      getParameters: jest.fn().mockResolvedValue(Result.TaskOk(parameters)),
    }
    mockSalesforceClientService = {
      login: jest
        .fn()
        .mockResolvedValue(Result.TaskOk({ access_token: 'token' })),
      getUser: jest
        .fn()
        .mockResolvedValue(Result.TaskOk({ records: [{ Id: 'id' }] })),
    }
    mockSalesforceOpportunityService = {
      createOpportunity: jest
        .fn()
        .mockResolvedValue(Result.TaskOk({ id: 'id' })),
    }
    mockOpportunityService = {
      processOpporunity: jest
        .fn()
        .mockResolvedValue(Result.TaskOk({ data: 'data' })),
    }
    const response = await abandonedCartHook(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })

  test('Error execute abandoned cart', async () => {
    mockMasterDataService = {
      getParameters: jest.fn().mockRejectedValue(Result.TaskError('error')),
    }
    const response = await abandonedCartHook(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })
})
