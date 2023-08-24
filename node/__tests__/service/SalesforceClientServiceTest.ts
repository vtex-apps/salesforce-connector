import { AddressVtexResponse } from "../../schemas/AddressVtexResponse";
import { ClientVtexResponse } from "../../schemas/ClientVtexResponse";
import SalesforceClient from "../../service/SalesforceClientService";

let mockAxios: any = {};

jest.mock('axios', () => ({
  create: jest.fn(() => (mockAxios))
}));

describe('SalesforceClient', () => {
  let service: SalesforceClient;
  let client: ClientVtexResponse;
  let address: AddressVtexResponse;
  beforeEach(() => {
    service = new SalesforceClient();
    client = {
      id: 'id',
      firstName: 'firstName',
      lastName: 'lastName',
      document: 'document',
      email: 'email',
      phone: 'phone',
      homePhone: 'homePhone',
    };
    address = {
      street: 'street',
      city: 'city',
      state: 'state',
      postalCode: 'postalCode',
      country: 'country',
    };
  });
  describe('get', () => {
    test('Get client in Salesforce', async () => {
      mockAxios = {
        get: jest.fn(() => Promise.resolve({
          status: 200,
          message: 'OK',
          data: 'Get client in Salesforce'
        })),
      };
      const response = await service.get('', '');
      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: 'Get client in Salesforce'
      });
    });

    test('Failure to get client in Salesforce', async () => {
      mockAxios = {
        get: jest.fn(() => Promise.resolve({
          status: 404,
          message: 'Not Found',
          data: 'Not found client in Salesforce'
        })),
      };
      const response = await service.get('', '');
      expect(response).toEqual({
        status: 404,
        message: 'Client could not be queried in salesforce',
        data: 'Not found client in Salesforce'
      });
    });

    test('Error to get client in Salesforce', async () => {
      mockAxios = {
        get: jest.fn(() => Promise.reject({
          status: 500,
          message: 'Error',
          data: 'Error to get client in Salesforce'
        })),
      };
      const response = await service.get('', '');
      expect(response).toEqual({
        status: 500,
        message: 'An error occurred while viewing the client',
        data: undefined
      });
    });

    test('Get user in Salesforce', async () => {
      mockAxios = {
        get: jest.fn(() => Promise.resolve({
          status: 200,
          message: 'OK',
          data: 'Get user in Salesforce'
        })),
      };
      const response = await service.getUser('', '');
      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: 'Get user in Salesforce'
      });
    });

    test('Failure to get user in Salesforce', async () => {
      mockAxios = {
        get: jest.fn(() => Promise.resolve({
          status: 404,
          message: 'Not Found',
          data: 'Not found user in Salesforce'
        })),
      };
      const response = await service.getUser('', '');
      expect(response).toEqual({
        status: 404,
        message: 'User could not be queried in salesforce',
        data: 'Not found user in Salesforce'
      });
    });

    test('Error to get user in Salesforce', async () => {
      mockAxios = {
        get: jest.fn(() => Promise.reject({
          status: 500,
          message: 'Error',
          data: 'Error to get user in Salesforce'
        })),
      };
      const response = await service.getUser('', '');
      expect(response).toEqual({
        status: 500,
        message: 'An error occurred while viewing the user',
        data: undefined
      });
    });

    test('create client in Salesforce', async () => {
      mockAxios = {
        post: jest.fn(() => Promise.resolve({
          status: 201,
          message: 'OK',
          data: 'Create client in Salesforce'
        })),
      };
      const response = await service.create(client, address, 'token');
      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: 'Create client in Salesforce'
      });
    });

    test('Failure to create client in Salesforce', async () => {
      mockAxios = {
        post: jest.fn(() => Promise.resolve({
          status: 500,
          message: '',
          data: 'Could not be created in salesforce'
        })),
      };
      const response = await service.create(client, address, 'token');
      expect(response).toEqual({
        status: 500,
        message: 'Client could not be created in salesforce',
        data: 'Could not be created in salesforce'
      });
    });

    test('Error to create client in Salesforce', async () => {
      mockAxios = {
        post: jest.fn(() => Promise.reject({
          status: 500,
          message: 'Error',
          data: 'Error to create client in Salesforce'
        })),
      };
      const response = await service.create(client, address, 'token');
      expect(response).toEqual({
        status: 500,
        message: 'An error occurred when creating client in salesforce',
        data: undefined
      });
    });

    test('update client in Salesforce', async () => {
      mockAxios = {
        patch: jest.fn(() => Promise.resolve({
          status: 200,
          message: 'OK',
          data: 'Update client in Salesforce'
        })),
      };
      const response = await service.update(client, address, 'id', 'token');
      expect(response).toEqual({
        status: 200,
        message: 'OK',
        data: 'Update client in Salesforce'
      });
    });

    test('Failure to update client in Salesforce', async () => {
      mockAxios = {
        patch: jest.fn(() => Promise.resolve({
          status: 500,
          message: '',
          data: 'Could not be updated in salesforce'
        })),
      };
      const response = await service.update(client, address, 'id', 'token');
      expect(response).toEqual({
        status: 500,
        message: 'Client could not be updated in salesforce',
        data: 'Could not be updated in salesforce'
      });
    });

    test('Error to update client in Salesforce', async () => {
      mockAxios = {
        patch: jest.fn(() => Promise.reject({
          status: 500,
          message: 'Error',
          data: 'Error to update client in Salesforce'
        })),
      };
      const response = await service.update(client, address, 'id', 'token');
      expect(response).toEqual({
        status: 500,
        message: 'An error occurred when updating client in salesforce',
        data: undefined
      });
    });
  });
});
