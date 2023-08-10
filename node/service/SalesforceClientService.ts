import axios, { AxiosInstance } from 'axios';
import qs from 'qs';
import { CLIENT_ID, CLIENT_SECRET, CODE_STATUS_201, GRANT_TYPE, PASSWORD, PATH_API_SALESFORCE, PATH_CONTACT_SALESFORCE, PATH_QUERY_SALESFORCE, URI_SALESFORCE, URI_SALESFORCE_AUTH, USERNAME } from '../utils/constans';
import { Result } from '../schemas/Result';
import { ClientVtexResponse } from '../schemas/ClientVtexResponse';
import { AddressVtexResponse } from '../schemas/AddressVtexResponse';
import MasterDataOrderService from './MasterDataService';
import { ParameterList } from '../schemas/Parameter';

export default class SalesforceClient {
  public auth = async (account: string, httpVTX: AxiosInstance) => {
    const result = new Result();
    const http = axios.create({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const masterDataService = new MasterDataOrderService();
    const resultParameters = await masterDataService.getParameters(account, httpVTX);
    const parameterList = new ParameterList(resultParameters.data);
    const url = URI_SALESFORCE_AUTH;
    const data = qs.stringify({
      grant_type: GRANT_TYPE,
      client_id: parameterList.get(CLIENT_ID),
      client_secret: parameterList.get(CLIENT_SECRET),
      username: parameterList.get(USERNAME),
      password: parameterList.get(PASSWORD),
    });
    try {
      const response = await http.post(url, data);
      result.ok(response.data.access_token)
      return result;
    }
    catch (error) {
      result.error('Ocurrio un error al obtener el token', error)
      return result;
    }
  }

  public get = async (email: string, accessToken: string) => {
    const result = new Result();
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
      result.ok(response.data)
      return result;
    }
    catch (error) {
      result.error('Ocurrio un error al obtener el cliente', error)
      return result;
    }
  }

  public getUser = async (email: string, accessToken: string) => {
    const result = new Result();
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
      result.ok(response.data)
      return result;
    }
    catch (error) {
      result.error('Ocurrio un error al obtener el cliente', error)
      return result;
    }
  }

  public create = async (clientVtex: ClientVtexResponse, address: AddressVtexResponse, accessToken: string) => {
    const result = new Result();
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
      result.rst(CODE_STATUS_201, response.data)
      return result;
    }
    catch (error) {
      result.error('Ocurrio un error al crear el cliente', error)
      return result;
    }
  }

  public update = async (clientVtex: ClientVtexResponse, address: AddressVtexResponse, idClientSalesforce: string, accessToken: string) => {
    const result = new Result();
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
      result.ok(response.data)
      return result;
    }
    catch (error) {
      result.error('Ocurrio un error al actualizar el cliente', error)
      return result;
    }
  }
}
