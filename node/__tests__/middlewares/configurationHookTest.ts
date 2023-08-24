import { configurationHook } from "../../middlewares/configurationHook";
import { Parameter } from "../../schemas/Parameter";
import { Result } from "../../schemas/Result";
import { ACCESS_TOKEN_SALEFORCE } from "../../utils/constans";

let mockCreateEntitiesMasterDataV2Service: any;
let mockMasterDataService: any;
let mockSalesforceConfigurationService: any;

jest.mock('../../service/CreateEntitiesMasterDataV2Service', () => jest.fn().mockImplementation(() => mockCreateEntitiesMasterDataV2Service));
jest.mock('../../service/MasterDataService', () => jest.fn().mockImplementation(() => mockMasterDataService));
jest.mock('../../service/SalesforceConfigurationService', () => jest.fn().mockImplementation(() => mockSalesforceConfigurationService));

describe('configurationHook', () => {
  let ctx: any;
  const parameters: Parameter[] = [];
  beforeEach(() => {
    ctx = {
      vtex: {
        authToken: 'vtexappkey-xxx-xxx-xxx-xxx',
      },
      clients: {
        masterDataClient: {
          createTrigger: jest.fn().mockResolvedValue(Result.TaskOk({})),
        },
      },
    }
    const parameterToken = {
      id: ACCESS_TOKEN_SALEFORCE,
      parameterValue: 'token',
    }
    parameters.push(parameterToken);
  });
  
  test('Success to execute configuration', async () => {
    mockCreateEntitiesMasterDataV2Service = {
      createEntity: jest.fn().mockResolvedValue(Result.TaskOk({})),
    }
    mockMasterDataService = {
      getParameters: jest.fn().mockResolvedValue(Result.TaskOk(parameters))
    }
    mockSalesforceConfigurationService = {
      getFielsOrder: jest.fn().mockResolvedValue(Result.TaskOk({ fields: [{ name: 'Order_Status__c' }] })),
    }
    const response = await configurationHook(ctx, () => Promise.resolve());
    expect(response).toBeUndefined();
  });

  test('Error to execute configuration', async () => {
    mockMasterDataService = {
      getParameters: jest.fn().mockRejectedValue(Result.TaskError('error')),
    }
    const response = await configurationHook(ctx, () => Promise.resolve());
    expect(response).toBeUndefined();
  });
});
