import { Parameter, ParameterList } from "../../schemas/Parameter";
import { Result } from "../../schemas/Result";
import ConfigurationService from "../../service/ConfigurationService";
import { LIST_PRICE_ID } from "../../utils/constans";

jest.mock('co-body', () => ({
  json: jest.fn().mockReturnValue({ email: 'email' }),
}));

let mockSalesforceConfigurationService: any;
let mockMasterDataService: any;

jest.mock('../../service/SalesforceConfigurationService', () => jest.fn().mockImplementation(() => mockSalesforceConfigurationService));
jest.mock('../../service/MasterDataService', () => jest.fn().mockImplementation(() => mockMasterDataService));

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let ctx: any;
  let parameterList: ParameterList;
  beforeEach(() => {
    service = new ConfigurationService();
    ctx = {
      vtex: {
        authToken: 'token',
      },
      req: {},
    };
    const parameterListPrice = {
      id: LIST_PRICE_ID,
      parameterValue: "LIST_PRICE_ID"
    }
    const parameters: Parameter[] = []
    parameters.push(parameterListPrice)
    parameterList = new ParameterList(parameters)
  });
  
  test('Execute success proccess configuration', async () => {
    mockSalesforceConfigurationService = {
      createPricebook: jest.fn().mockReturnValue(Result.TaskOk({})),
      createAccount: jest.fn().mockReturnValue(Result.TaskOk({})),
      createCustomField: jest.fn().mockReturnValue({}),
    };
    mockMasterDataService = {
      saveUpdateParameter: jest.fn().mockReturnValue({}),
    };
    const response = await service.proccessConfiguration('token', ctx, parameterList, 0);
    expect(response).toEqual({
      data: 'Configuration completed successfully',
      status: 200,
      message: 'OK',
    });
  });

  test('Create pricebook in Salesforce', async () => {
    parameterList.remove(LIST_PRICE_ID);
    mockSalesforceConfigurationService = {
      createPricebook: jest.fn().mockReturnValue(Result.TaskOk({})),
      createAccount: jest.fn().mockReturnValue(Result.TaskOk({})),
      createCustomField: jest.fn().mockReturnValue({}),
    };
    mockMasterDataService = {
      saveUpdateParameter: jest.fn().mockReturnValue({}),
    };
    const response = await service.proccessConfiguration('token', ctx, parameterList, 0);
    expect(response).toEqual({
      data: 'Configuration completed successfully',
      status: 200,
      message: 'OK',
    });
  });
});
