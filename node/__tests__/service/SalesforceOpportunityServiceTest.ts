import type { AxiosInstance } from 'axios'
import axios from 'axios'

import SalesforceOpportunityService from '../../service/SalesforceOpportunityService'
import type { AbandonedCartResponse } from '../../schemas/AbandonedCartResponse'
import type { Parameter } from '../../schemas/Parameter'
import { ParameterList } from '../../schemas/Parameter'
import type { Item } from '../../schemas/orderVtexResponse'

describe('SalesforceOpportunityService', () => {
  let service: SalesforceOpportunityService
  let mockAxiosInstance: AxiosInstance
  let request: AbandonedCartResponse
  let parameterList: ParameterList
  let item: Item

  beforeEach(() => {
    service = new SalesforceOpportunityService()
    mockAxiosInstance = axios.create()
    request = {
      email: 'email',
      carttag: 'carttag',
      rclastsessiondate: 'rclastsessiondate',
      items: [],
    }
    const parameter: Parameter = {
      id: 'id',
      parameterValue: 'parameterValue',
    }

    const parameters: Parameter[] = []

    parameters.push(parameter)
    parameterList = new ParameterList(parameters)
    item = {
      id: '',
      productId: '',
      uniqueId: '',
      name: '',
      quantity: 0,
      measurementUnit: '',
      price: 0,
      imageUrl: '',
      refId: '',
      sellingPrice: 0,
    }
  })
  describe('createOpportunity', () => {
    test('create opportunity in Saleforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 201 })
      const response = await service.createOpportunity(
        request,
        parameterList,
        'userIdSaleforce',
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failed to create opportunity in salesforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 500 })
      const response = await service.createOpportunity(
        request,
        parameterList,
        'userIdSaleforce',
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 500,
        message: 'Opportunity could not be created in salesforce',
        data: undefined,
      })
    })

    test('Error to create opportunity in salesforce', async () => {
      jest
        .spyOn(mockAxiosInstance, 'post')
        .mockRejectedValue(new Error('Request failed with status code 400'))
      const response = await service.createOpportunity(
        request,
        parameterList,
        'userIdSaleforce',
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 500,
        message: 'An error occurred when creating opportunity in salesforce',
        data: new Error('Request failed with status code 400'),
      })
    })
  })

  describe('associateOpportunityAndProduct', () => {
    test('create associate opportunity and product in Saleforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 201 })
      const response = await service.associateOpportunityAndProduct(
        '',
        '',
        item,
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined,
      })
    })

    test('Failed to create associate opportunity and product in Saleforce', async () => {
      jest.spyOn(mockAxiosInstance, 'post').mockResolvedValue({ status: 500 })
      const response = await service.associateOpportunityAndProduct(
        '',
        '',
        item,
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 500,
        message: 'OpportunityLineItem could not be created in salesforce',
        data: undefined,
      })
    })

    test('Error to create associate opportunity and product in Saleforce', async () => {
      jest
        .spyOn(mockAxiosInstance, 'post')
        .mockRejectedValue(new Error('Request failed with status code 400'))
      const response = await service.associateOpportunityAndProduct(
        '',
        '',
        item,
        mockAxiosInstance
      )

      expect(response).toEqual({
        status: 500,
        message:
          'An error occurred when creating OpportunityLineItem in salesforce',
        data: new Error('Request failed with status code 400'),
      })
    })
  })
})
