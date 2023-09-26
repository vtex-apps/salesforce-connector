import { addCredentialsHook } from '../../middlewares/addCredentialsHook'
import type { Parameter } from '../../schemas/Parameter'
import { Result } from '../../schemas/Result'
import { ACCOUNT_SALESFORCE } from '../../utils/constans'

let mockMasterDataService: any
let mockCreateEntitiesMasterDataV2Service: any

jest.mock('co-body', () => ({
  json: jest.fn().mockReturnValue({
    accountSalesforce: 'accountSalesforce',
    clientId: 'clientId',
    clientSecret: 'clientSecret',
  }),
}))

jest.mock('../../service/masterDataService', () =>
  jest.fn().mockImplementation(() => mockMasterDataService)
)
jest.mock('../../service/CreateEntitiesMasterDataV2Service', () =>
  jest.fn().mockImplementation(() => mockCreateEntitiesMasterDataV2Service)
)

describe('addCredentialsHook', () => {
  let ctx: any
  const parameters: Parameter[] = []

  beforeEach(() => {
    ctx = {
      vtex: {
        authToken: 'vtexappkey-xxx-xxx-xxx-xxx',
      },
      clients: {
        masterDataClient: {
          createTrigger: jest.fn().mockResolvedValue({}),
        },
      },
      req: {
        email: 'email',
      },
    }
    const parameter = {
      id: ACCOUNT_SALESFORCE,
      parameterValue: 'token',
    }

    parameters.push(parameter)
  })

  test('Success to add credentials', async () => {
    mockMasterDataService = {
      saveUpdateParameter: jest.fn().mockResolvedValue(Result.TaskOk({})),
    }

    mockCreateEntitiesMasterDataV2Service = {
      createEntity: jest.fn().mockResolvedValue(Result.TaskOk({})),
    }

    const response = await addCredentialsHook(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })

  test('Error to add credentials', async () => {
    mockMasterDataService = {
      saveUpdateParameter: jest
        .fn()
        .mockRejectedValue(Result.TaskError('Error')),
    }

    const response = await addCredentialsHook(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })
})
