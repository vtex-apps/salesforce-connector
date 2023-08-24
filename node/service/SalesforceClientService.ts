import axios from 'axios';
import { CODE_STATUS_200, CODE_STATUS_201, CODE_STATUS_204, PATH_API_SALESFORCE, PATH_CONTACT_SALESFORCE, PATH_QUERY_SALESFORCE, URI_SALESFORCE } from '../utils/constans';
import { Result } from '../schemas/Result';
import { ClientVtexResponse } from '../schemas/ClientVtexResponse';
import { AddressVtexResponse } from '../schemas/AddressVtexResponse';

export default class SalesforceClient {
  public get = async (email: string, accessToken: string) => {
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache",
        "X-Vtex-Use-Https": "true",
        'Content-Type': 'application/json'
      }
    });
    const url = `${URI_SALESFORCE}${PATH_QUERY_SALESFORCE}SELECT+id,Email+FROM+Contact+WHERE+Email+=+'${email}'`;
    try {
      const response = await http.get(url);
      if (response.status == CODE_STATUS_200 || response.status == CODE_STATUS_201 || response.status == CODE_STATUS_204) {
        return Result.TaskOk(response.data);
      } else {
        return Result.TaskResult(response.status, "Client could not be queried in salesforce", response.data);
      }
    }
    catch (error) {
      return Result.TaskError('An error occurred while viewing the client')
    }
  }

  public getUser = async (email: string, accessToken: string) => {
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache",
        "X-Vtex-Use-Https": "true",
        'Content-Type': 'application/json'
      }
    });
    const url = `${URI_SALESFORCE}${PATH_QUERY_SALESFORCE}SELECT+id,Email+FROM+User+WHERE+Email+=+'${email}'`;
    try {
      const response = await http.get(url);
      if (response.status == CODE_STATUS_200 || response.status == CODE_STATUS_201 || response.status == CODE_STATUS_204) {
        return Result.TaskOk(response.data);
      } else {
        return Result.TaskResult(response.status, "User could not be queried in salesforce", response.data);
      }
    }
    catch (error) {
      return Result.TaskError('An error occurred while viewing the user')
    }
  }

  public create = async (clientVtex: ClientVtexResponse, address: AddressVtexResponse, accessToken: string) => {
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache",
        "X-Vtex-Use-Https": "true",
        'Content-Type': 'application/json'
      }
    });
    const data = {
      FirstName: clientVtex.firstName,
      LastName: clientVtex.lastName,
      Email: clientVtex.email,
      Phone: clientVtex.homePhone ? clientVtex.homePhone : clientVtex.phone,
      MailingStreet: address ? address.street : '',
      MailingCity: address ? address.city : '',
      MailingState: address ? address.state : '',
      MailingPostalCode: address ? address.postalCode : '',
      MailingCountry: address ? address.country : '',
    }
    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_CONTACT_SALESFORCE}`;
    try {
      const response = await http.post(url, data);
      if (response.status == CODE_STATUS_200 || response.status == CODE_STATUS_201) {
        return Result.TaskOk(response.data);
      } else {
        return Result.TaskResult(response.status, "Client could not be created in salesforce", response.data);
      }
    } catch (error) {
      return Result.TaskError("An error occurred when creating client in salesforce")
    }
  }

  public update = async (clientVtex: ClientVtexResponse, address: AddressVtexResponse, idClientSalesforce: string, accessToken: string) => {
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache",
        "X-Vtex-Use-Https": "true",
        'Content-Type': 'application/json'
      }
    });
    const data = {
      FirstName: clientVtex.firstName,
      LastName: clientVtex.lastName,
      Email: clientVtex.email,
      Phone: clientVtex.homePhone ? clientVtex.homePhone : clientVtex.phone,
      MailingStreet: address ? address.street : '',
      MailingCity: address ? address.city : '',
      MailingState: address ? address.state : '',
      MailingPostalCode: address ? address.postalCode : '',
      MailingCountry: address ? address.country : '',
    }
    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_CONTACT_SALESFORCE}/${idClientSalesforce}`;
    try {
      const response = await http.patch(url, data);
      if (response.status == CODE_STATUS_200 || response.status == CODE_STATUS_201) {
        return Result.TaskOk(response.data);
      } else {
        return Result.TaskResult(response.status, "Client could not be updated in salesforce", response.data);
      }
    } catch (error) {
      return Result.TaskError("An error occurred when updating client in salesforce")
    }
  }
}
