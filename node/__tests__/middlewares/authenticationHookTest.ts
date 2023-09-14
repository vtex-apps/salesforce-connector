import axios from 'axios'

import { authenticationHook } from '../../middlewares/authenticationHook'
import type { Parameter } from '../../schemas/Parameter'
import { Result } from '../../schemas/Result'
import { CLIENT_ID, CLIENT_SECRET } from '../../utils/constans'

let mockMasterDataService: any

jest.mock('../../service/masterDataService', () =>
  jest.fn().mockImplementation(() => mockMasterDataService)
)

describe('authenticationHook', () => {
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
      url: 'url?code=code',
    }
    const parameterClientId = {
      id: CLIENT_ID,
      parameterValue: 'clientId',
    }

    const parameteClientSecret = {
      id: CLIENT_SECRET,
      parameterValue: 'clientSecret',
    }

    parameters.push(parameterClientId)
    parameters.push(parameteClientSecret)
  })

  test('Success to execute authentication Salesforce', async () => {
    mockMasterDataService = {
      getParameters: jest.fn().mockResolvedValue(Result.TaskOk(parameters)),
      saveUpdateParameter: jest.fn().mockResolvedValue(Result.TaskOk({})),
    }
    const responseData = { key: 'value' }

    jest.spyOn(axios, 'post').mockResolvedValue({ data: responseData })
    const response = await authenticationHook(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })

  test('Error to execute authentication Salesforce', async () => {
    mockMasterDataService = {
      getParameters: jest.fn().mockRejectedValue(Result.TaskError('error')),
    }
    const response = await authenticationHook(ctx, () => Promise.resolve())

    expect(response).toBeUndefined()
  })
})
