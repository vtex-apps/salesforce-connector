// import { ParameterList } from "../../schemas/Parameter";
// import { Result } from "../../schemas/Result";
// import MasterDataService from "../../service/MasterDataService";
// import SalesforceConfigurationService from "../../service/SalesforceConfigurationService";
// import { getHttpVTX } from "../../utils/HttpUtil";

// // Mocks
// jest.mock('ParameterList');
// jest.mock('your-salesforceconfigurationservice-module');
// jest.mock('your-httpvtx-module');

// describe('proccessConfiguration', () => {
//   it('should complete configuration successfully', async () => {
//     const accessToken = 'fakeAccessToken';
//     const parameterList: ParameterList = [
//       { id: 'fakeParameterId1', parameterValue: 'fakeParameterValue1', description: 'fakeDescription1', groupName: 'fakeGroupName1' },
//       { id: 'fakeParameterId2', parameterValue: 'fakeParameterValue2', description: 'fakeDescription2', groupName: 'fakeGroupName2' },
//     ] as any;
//     const nameField = 0;

//     const masterDataServiceMock = new MasterDataService() as jest.Mocked<MasterDataService>;
//     masterDataServiceMock.saveUpdateParameter.mockResolvedValue(Result.TaskOk('fakeParameterId'));
    
//     const salesforceConfigurationServiceMock = new SalesforceConfigurationService() as jest.Mocked<SalesforceConfigurationService>;
//     salesforceConfigurationServiceMock.createPricebook.mockResolvedValue(Result.TaskOk('fakePricebookId'));
//     salesforceConfigurationServiceMock.createAccount.mockResolvedValue(Result.TaskOk('fakeAccountId'));
//     salesforceConfigurationServiceMock.createCustomField.mockResolvedValue(Result.TaskOk('fakeCustomFieldId'));
    
//     const httpVTXMock = {} as any;
//     (getHttpVTX as jest.Mock).mockResolvedValue(httpVTXMock);

//     const result = await processConfiguration(accessToken, ctx, parameterList, nameField);

//     expect(result).toEqual(Result.TaskOk('Configuration completed successfully'));
//     expect(masterDataServiceMock.saveUpdateParameter).toHaveBeenCalledTimes(2); // Should be called twice
//     expect(salesforceConfigurationServiceMock.createPricebook).toHaveBeenCalledWith(accessToken);
//     expect(salesforceConfigurationServiceMock.createAccount).toHaveBeenCalledWith(accessToken);
//     expect(salesforceConfigurationServiceMock.createCustomField).toHaveBeenCalledWith(accessToken);

//     // You can also add more specific assertions based on your actual implementation
//   });

//   it('should handle errors during configuration', async () => {
//     // Similar to the successful test, but you can mock services to throw errors
//   });
// });
