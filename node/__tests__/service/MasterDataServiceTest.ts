import axios, { AxiosInstance } from "axios";
import MasterDataService from "../../service/MasterDataService";
import { OrderSalesforce, PriceBookEntryOrderSalesforce } from "../../schemas/OrderSalesforce";
import { Parameter } from "../../schemas/Parameter";

describe('MasterDataService', () => {
  let service: MasterDataService;
  let mockAxiosInstance: AxiosInstance;
  beforeEach(() => {
    service = new MasterDataService();
    mockAxiosInstance = axios.create();
  });
  describe('saveUpdateOrder', () => {
    test('Save or update order in MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'put').mockResolvedValue({ status: 200 });
      const order: OrderSalesforce = {
        id: 'id',
        idSfc: 'idSfc',
        statusOrder: 'statusOrder',
        updateDate: 'updateDate',
      }
      const response = await service.saveUpdateOrder(order, 'accountVtex', mockAxiosInstance);
      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined
      });
    });

    test('No register order in MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'put').mockResolvedValue({ status: 404 });
      const order: OrderSalesforce = {
        id: 'id',
        idSfc: 'idSfc',
        statusOrder: 'statusOrder',
        updateDate: 'updateDate',
      }
      const response = await service.saveUpdateOrder(order, 'accountVtex', mockAxiosInstance);
      expect(response).toEqual({
        status: 404,
        message: 'could not be registered Order in MTDT',
        data: undefined
      });
    });

    test('Error to register order in MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'put').mockRejectedValue(new Error('Request failed with status code 400'));
      const order: OrderSalesforce = {
        id: 'id',
        idSfc: 'idSfc',
        statusOrder: 'statusOrder',
        updateDate: 'updateDate',
      }
      const response = await service.saveUpdateOrder(order, 'accountVtex', mockAxiosInstance);
      expect(response).toEqual({
        status: 500,
        message: 'an error has occurred  in saveUpdateOrder',
        data: new Error('Request failed with status code 400')
      });
    });
  });

  describe('saveUpdateParameter', () => {
    test('Save or update order in MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'put').mockResolvedValue({ status: 200 });
      const parameter: Parameter = {
        id: "id",
        parameterValue: "parameterValue"
      }
      const response = await service.saveUpdateParameter(parameter, 'accountVtex', mockAxiosInstance);
      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined
      });
    });

    test('No register parameter in MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'put').mockResolvedValue({ status: 404 });
      const parameter: Parameter = {
        id: "id",
        parameterValue: "parameterValue"
      }
      const response = await service.saveUpdateParameter(parameter, 'accountVtex', mockAxiosInstance);
      expect(response).toEqual({
        status: 404,
        message: 'could not be registered Parameters in MTDT',
        data: undefined
      });
    });

    test('Error to register parameter in MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'put').mockRejectedValue(new Error('Request failed with status code 400'));
      const parameter: Parameter = {
        id: "id",
        parameterValue: "parameterValue"
      }
      const response = await service.saveUpdateParameter(parameter, 'accountVtex', mockAxiosInstance);
      expect(response).toEqual({
        status: 500,
        message: 'an error has occurred  in saveParameters',
        data: new Error('Request failed with status code 400')
      });
    });
  });

  describe('saveUpdatePriceBookEntry', () => {
    test('Save or update priceBookEntry in MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'put').mockResolvedValue({ status: 200 });
      const priceBookEntry: PriceBookEntryOrderSalesforce = {
        id: "id",
        priceBookEntryId: "priceBookEntryId"
      }
      const response = await service.saveUpdatePriceBookEntry(priceBookEntry, 'accountVtex', mockAxiosInstance);
      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: undefined
      });
    });

    test('No register priceBookEntry in MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'put').mockResolvedValue({ status: 404 });
      const priceBookEntry: PriceBookEntryOrderSalesforce = {
        id: "id",
        priceBookEntryId: "priceBookEntryId"
      }
      const response = await service.saveUpdatePriceBookEntry(priceBookEntry, 'accountVtex', mockAxiosInstance);
      expect(response).toEqual({
        status: 404,
        message: 'could not be registered PriceBookEntry in MTDT',
        data: undefined
      });
    });

    test('Error to register priceBookEntry in MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'put').mockRejectedValue(new Error('Request failed with status code 400'));
      const priceBookEntry: PriceBookEntryOrderSalesforce = {
        id: "id",
        priceBookEntryId: "priceBookEntryId"
      }
      const response = await service.saveUpdatePriceBookEntry(priceBookEntry, 'accountVtex', mockAxiosInstance);
      expect(response).toEqual({
        status: 500,
        message: 'an error has occurred  in saveUpdatePriceBookEntry',
        data: new Error('Request failed with status code 400')
      });
    });
  });

  describe('getParameters', () => {
    test('get parameters from MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockResolvedValue({ status: 200, data: [ {} ] });
      const response = await service.getParameters('accontVtex', mockAxiosInstance);
      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: [ {} ]
      });
    });

    test('Failed to get parameters from MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockResolvedValue({ status: 404 });
      const response = await service.getParameters('accountVtex', mockAxiosInstance);
      expect(response).toEqual({
        status: 404,
        message: 'could not be get Parameters in MTDT',
        data: undefined
      });
    });

    test('Error to get parameters from MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockRejectedValue(new Error('Request failed with status code 400'));
      const response = await service.getParameters('accountVtex', mockAxiosInstance);
      expect(response).toEqual({
        status: 500,
        message: 'an error has occurred  in getParameters',
        data: new Error('Request failed with status code 400')
      });
    });
  });

  describe('getPriceBookEntry', () => {
    test('get priceBookEntry from MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockResolvedValue({ status: 200, data: [ {} ] });
      const response = await service.getPriceBookEntry('id', 'accontVtex', mockAxiosInstance);
      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: [ {} ]
      });
    });

    test('Failed to get priceBookEntry from MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockResolvedValue({ status: 404 });
      const response = await service.getPriceBookEntry('id', 'accountVtex', mockAxiosInstance);
      expect(response).toEqual({
        status: 404,
        message: 'not found PriceBookEntry in MTDT',
        data: undefined
      });
    });

    test('Error to get priceBookEntry from MTDT', async () => {
      jest.spyOn(mockAxiosInstance, 'get').mockRejectedValue(new Error('Request failed with status code 400'));
      const response = await service.getPriceBookEntry('id', 'accountVtex', mockAxiosInstance);
      expect(response).toEqual({
        status: 500,
        message: 'an error has occurred  in PriceBookEntry',
        data: new Error('Request failed with status code 400')
      });
    });
  });
});
