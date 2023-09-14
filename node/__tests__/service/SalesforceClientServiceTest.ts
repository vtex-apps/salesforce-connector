import type { AxiosInstance } from 'axios'
import axios from 'axios'

import type { AddressVtexResponse } from '../../schemas/AddressVtexResponse'
import type { ClientVtexResponse } from '../../schemas/ClientVtexResponse'
import SalesforceClient from '../../service/SalesforceClientService'

describe('SalesforceClient', () => {
  let service: SalesforceClient
  let client: ClientVtexResponse
  let address: AddressVtexResponse
  let mockAxiosInstance: AxiosInstance

  beforeEach(() => {
    service = new SalesforceClient()
    mockAxiosInstance = axios.create()
    client = {
      id: 'id',
      firstName: 'firstName',
      lastName: 'lastName',
      document: 'document',
      email: 'email',
      phone: 'phone',
      homePhone: 'homePhone',
      birthDate: 'birthDate',
    }
    address = {
      street: 'street',
      city: 'city',
      state: 'state',
      postalCode: 'postalCode',
      country: 'country',
    }
  })
  describe('get', () => {
    test('Get client in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockResolvedValue({ status: 200 })
      const response = await service.get('', mockAxiosInstance)

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failure to get client in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockResolvedValue({ status: 404 })
      const response = await service.get('', mockAxiosInstance)

      expect(response).toEqual({
        status: 404,
        message: 'Client could not be queried in salesforce',
        data: undefined,
      })
    })

    test('Error to get client in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockRejectedValue({ status: 500 })
      const response = await service.get('', mockAxiosInstance)

      expect(response).toEqual({
        status: 500,
        message: 'An error occurred while viewing the client',
        data: undefined,
      })
    })

    test('Get user in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockResolvedValue({ status: 200 })
      const response = await service.getUser('', mockAxiosInstance)

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failure to get user in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockResolvedValue({ status: 404 })
      const response = await service.getUser('', mockAxiosInstance)

      expect(response).toEqual({
        status: 404,
        message: 'User could not be queried in salesforce',
        data: undefined,
      })
    })

    test('Error to get user in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockRejectedValue({ status: 500 })
      const response = await service.getUser('', mockAxiosInstance)

      expect(response).toEqual({
        status: 500,
        message: 'An error occurred while viewing the user',
        data: undefined,
      })
    })

    test('create client in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 201 })
      const response = await service.create(client, address, mockAxiosInstance)

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failure to create client in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 500 })
      const response = await service.create(client, address, mockAxiosInstance)

      expect(response).toEqual({
        status: 500,
        message: 'Client could not be created in salesforce',
        data: undefined,
      })
    })

    test('Error to create client in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockRejectedValue({ status: 500 })
      const response = await service.create(client, address, mockAxiosInstance)

      expect(response).toEqual({
        status: 500,
        message: 'An error occurred when creating client in salesforce',
        data: undefined,
      })
    })

    test('update client in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'patch').mockResolvedValue({ status: 200 })
      const response = await service.update(
        client,
        address,
        'id',
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failure to update client in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'patch').mockResolvedValue({ status: 500 })
      const response = await service.update(
        client,
        address,
        'id',
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 500,
        message: 'Client could not be updated in salesforce',
        data: undefined,
      })
    })

    test('Error to update client in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'patch').mockRejectedValue({ status: 500 })
      const response = await service.update(
        client,
        address,
        'id',
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 500,
        message: 'An error occurred when updating client in salesforce',
        data: undefined,
      })
    })
  })
})
