import { getParametersHook } from '../../middlewares/getParametersHook'
import type { Parameter } from '../../schemas/Parameter'
import { Result } from '../../schemas/Result'
import { ACCOUNT_SALESFORCE } from '../../utils/constans'

let mockMasterDataService: any

jest.mock('../../service/masterDataService', () =>
  jest.fn().mockImplementation(() => mockMasterDataService)
)

describe('getParametersHook', () => {
  let ctx: any
  const parameters: Parameter[] = []

  beforeEach(() => {
    ctx = {
      vtex: {
        authToken: 'vtexappkey-xxx-xxx-xxx-xxx',
      },
    }
    const parameter = {
      id: ACCOUNT_SALESFORCE,
      parameterValue: 'token',
    }

    parameters.push(parameter)
  })

  test('Success to get parameters', async () => {
    mockMasterDataService = {
      getParameters: jest.fn().mockResolvedValue(Result.TaskOk(parameters)),
    }

    const response = await getParametersHook(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })

  test('Error to get parameters', async () => {
    mockMasterDataService = {
      getParameters: jest.fn().mockRejectedValue(Result.TaskError('error')),
    }
    const response = await getParametersHook(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })
})
