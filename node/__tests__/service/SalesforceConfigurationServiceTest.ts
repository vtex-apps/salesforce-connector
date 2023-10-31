import type { AxiosInstance } from 'axios'
import axios from 'axios'

import SalesforceConfigurationService from '../../service/SalesforceConfigurationService'

describe('SalesforceConfigurationService', () => {
  let service: SalesforceConfigurationService
  let mockAxiosInstance: AxiosInstance
  const accessToken = 'access_token'

  beforeEach(() => {
    service = new SalesforceConfigurationService()
    mockAxiosInstance = axios.create()
  })
  describe('createPricebook', () => {
    test('create pricebook in SalesForce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 201 })
      const response = await service.createPricebook(mockAxiosInstance)

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failed to create pricebook in salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 500 })
      const response = await service.createPricebook(mockAxiosInstance)

      expect(response).toEqual({
        status: 500,
        message: 'Pricebook could not be created in salesforce',
        data: undefined,
      })
    })

    test('Error to create pricebook in salesforce', async () => {
      jest
        .spyOn(mockAxiosInstance, 'post')
        .mockRejectedValue(new Error('Request failed with status code 400'))
      const response = await service.createPricebook(mockAxiosInstance)

      expect(response).toEqual({
        status: 500,
        message: 'An error occurred when creating pricebook in salesforce',
        data: new Error('Request failed with status code 400'),
      })
    })
  })

  describe('createAccount', () => {
    test('create account in SalesForce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 201 })
      const response = await service.createAccount(mockAxiosInstance)

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failed to create account in salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 500 })
      const response = await service.createAccount(mockAxiosInstance)

      expect(response).toEqual({
        status: 500,
        message: 'Account could not be created in salesforce',
        data: undefined,
      })
    })

    test('Error to create account in salesforce', async () => {
      jest
        .spyOn(mockAxiosInstance, 'post')
        .mockRejectedValue(new Error('Request failed with status code 400'))
      const response = await service.createAccount(mockAxiosInstance)

      expect(response).toEqual({
        status: 500,
        message: 'An error occurred when creating account in salesforce',
        data: new Error('Request failed with status code 400'),
      })
    })
  })

  describe('createCustomField', () => {
    test('create custom field in SalesForce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 201 })
      const response = await service.createCustomField(
        mockAxiosInstance,
        accessToken
      )

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: 'Custom fields created successfully',
      })
    })

    test('Failed to create custom field in salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 500 })
      const response = await service.createCustomField(
        mockAxiosInstance,
        accessToken
      )

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: 'Custom fields created successfully',
      })
    })
  })

  describe('getFielsOrder', () => {
    test('get fiels order of SalesForce', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockResolvedValue({ status: 200 })
      const response = await service.getFielsOrder(mockAxiosInstance)

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failed to get fiels order of SalesForce', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockResolvedValue({ status: 404 })
      const response = await service.getFielsOrder(mockAxiosInstance)

      expect(response).toEqual({
        status: 404,
        message: 'Order fields could not be queried in salesforce',
        data: undefined,
      })
    })

    test('Error to get fiels order of SalesForce', async () => {
      jest
        .spyOn(mockAxiosInstance, 'get')
        .mockRejectedValue(new Error('Request failed with status code 400'))
      const response = await service.getFielsOrder(mockAxiosInstance)

      expect(response).toEqual({
        status: 500,
        message: 'an error occurred while viewing the Order fields',
        data: new Error('Request failed with status code 400'),
      })
    })
  })
})
