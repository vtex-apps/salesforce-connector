import type { AxiosInstance } from 'axios'
import axios from 'axios'

import CreateEntitiesMasterDataV2Service from '../../service/CreateEntitiesMasterDataV2Service'

describe('CreateEntitiesMasterDataV2Service', () => {
  let service: CreateEntitiesMasterDataV2Service
  let mockAxiosInstance: AxiosInstance

  beforeEach(() => {
    service = new CreateEntitiesMasterDataV2Service()
    mockAxiosInstance = axios.create()
  })
  describe('createEntity', () => {
    test('registers entities successfully in MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'put').mockResolvedValue({ status: 200 })
      const response = await service.createEntity('', mockAxiosInstance)

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: 'Entities registered in MTDT',
      })
    })

    test('No register entities in MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'put').mockResolvedValue({ status: 500 })
      const response = await service.createEntity('', mockAxiosInstance)

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: 'Entities registered in MTDT',
      })
    })
  })
})
