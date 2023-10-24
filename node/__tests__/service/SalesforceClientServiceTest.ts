import type { AxiosInstance } from 'axios'
import axios from 'axios'

import type { AddressVtexResponse } from '../../schemas/AddressVtexResponse'
import type { ClientVtexResponse } from '../../schemas/ClientVtexResponse'
import SalesforceClient from '../../service/SalesforceClientService'
import type { Parameter } from '../../schemas/Parameter'
import { ParameterList } from '../../schemas/Parameter'
import {
  ACCOUNT_SALESFORCE,
  CLIENT_ID,
  CLIENT_SECRET,
} from '../../utils/constans'

describe('SalesforceClient', () => {
  let service: SalesforceClient
  let client: ClientVtexResponse
  let address: AddressVtexResponse
  let mockAxiosInstance: AxiosInstance
  let parameterList: ParameterList

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
    const parameterAccountSalesforce: Parameter = {
      id: ACCOUNT_SALESFORCE,
      parameterValue: 'accountSalesforce',
    }

    const parameterClientId: Parameter = {
      id: CLIENT_ID,
      parameterValue: 'clientId',
    }

    const parameterClientSecret: Parameter = {
      id: CLIENT_SECRET,
      parameterValue: 'clientSecret',
    }

    const parameters: Parameter[] = []

    parameters.push(parameterAccountSalesforce)
    parameters.push(parameterClientId)
    parameters.push(parameterClientSecret)
    parameterList = new ParameterList(parameters)
  })
  describe('login', () => {
    test('Success to login in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 201 })
      const response = await service.login(parameterList, mockAxiosInstance)

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failure to login in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 500 })
      const response = await service.login(parameterList, mockAxiosInstance)

      expect(response).toEqual({
        status: 500,
        message: 'Could not login to salesforce',
        data: undefined,
      })
    })

    test('Error to login in Salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockRejectedValue({ status: 500 })
      const response = await service.login(parameterList, mockAxiosInstance)

      expect(response).toEqual({
        status: 500,
        message: 'An error occurred while logging in',
        data: undefined,
      })
    })
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

    describe('create', () => {
      test('create client in Salesforce', async () => {
        jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 201 })
        const response = await service.create(
          client,
          address,
          mockAxiosInstance
        )

        expect(response).toEqual({
          status: 200,
          message: 'OK',
          data: undefined,
        })
      })

      test('Failure to create client in Salesforce', async () => {
        jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 500 })
        const response = await service.create(
          client,
          address,
          mockAxiosInstance
        )

        expect(response).toEqual({
          status: 500,
          message: 'Client could not be created in salesforce',
          data: undefined,
        })
      })

      test('Error to create client in Salesforce', async () => {
        jest.spyOn(mockAxiosInstance, 'post').mockRejectedValue({ status: 500 })
        const response = await service.create(
          client,
          address,
          mockAxiosInstance
        )

        expect(response).toEqual({
          status: 500,
          message: 'An error occurred when creating client in salesforce',
          data: undefined,
        })
      })
    })

    describe('update', () => {
      test('update client in Salesforce', async () => {
        jest
          .spyOn(mockAxiosInstance, 'patch')
          .mockResolvedValue({ status: 200 })
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
        jest
          .spyOn(mockAxiosInstance, 'patch')
          .mockResolvedValue({ status: 500 })
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
        jest
          .spyOn(mockAxiosInstance, 'patch')
          .mockRejectedValue({ status: 500 })
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
})
