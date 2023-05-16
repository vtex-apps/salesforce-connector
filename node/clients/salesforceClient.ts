import { IOResponse } from '@vtex/api';
import axios from 'axios'
import qs from 'qs';
import { URL_SALESFORCE, URL_SALESFORCE_AUTH } from '../utils/constans';

export default class SalesforceClient {
  public auth = async () => {
    const http = axios.create({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const url = URL_SALESFORCE_AUTH;
    const data = qs.stringify({
      grant_type: 'password',
      client_id: '3MVG9gtDqcOkH4PKx5GaxzwrPnOsL886NZvqUj3hQddpkMGoEXP_KVm.Sg0tW8l34hWD1amdP3Hl_X9EbLZE1',
      client_secret: '4BF9EA8BC9EA6CAA2CE2505E50BE695F7802AF4414CCE2E048D7356492E279FB',
      username: 'giovannyj@titamedia.com',
      password: 'P@sto123NgVRH5yg0xLjIeGJseqp80In',
    });
    try {
      const response = await http.post(url, data);
      return response.data.access_token;
    }
    catch (error) {
      console.info('error', error)
    }
  }

  public get = async (clientVtex: IOResponse<any>, accessToken: string) => {
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control":"no-cache",
        "X-Vtex-Use-Https":"true",
        'Content-Type': 'application/json'
      }
    });
    const url = `${URL_SALESFORCE}/services/data/v57.0/query/?q=SELECT+id,Email+FROM+Contact+WHERE+Email+=+'${clientVtex.data[0].email}'`;
    try {
      const response = await http.get(url);
      return response.data;
    }
    catch (error) {
      console.info('error', error)
    }
  }

  public create = async (clientVtex: IOResponse<any>, adrress: any, accessToken: string) => {
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control":"no-cache",
        "X-Vtex-Use-Https":"true",
        'Content-Type': 'application/json'
      }
    });
    const data = {
      FirstName: clientVtex.data[0].firstName,
      LastName: clientVtex.data[0].lastName,
      Email: clientVtex.data[0].email,
      Phone: clientVtex.data[0].homePhone,
      MailingStreet: adrress.street,
      MailingCity: adrress.city,
      MailingState: adrress.state,
      MailingPostalCode: adrress.postalCode,
      MailingCountry: adrress.country,
    }
    const url = `${URL_SALESFORCE}/services/data/v57.0/sobjects/Contact`;
    try {
      const response = await http.post(url, data);
      return response.data;
    }
    catch (error) {
      console.info('error', error)
    }
  }

  public update = async (clientVtex: IOResponse<any>, adrress: any, idClientSalesforce: any, accessToken: string) => {
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control":"no-cache",
        "X-Vtex-Use-Https":"true",
        'Content-Type': 'application/json'
      }
    });
    const data = {
      FirstName: clientVtex.data[0].firstName,
      LastName: clientVtex.data[0].lastName,
      Email: clientVtex.data[0].email,
      Phone: clientVtex.data[0].homePhone,
      MailingStreet: adrress.street,
      MailingCity: adrress.city,
      MailingState: adrress.state,
      MailingPostalCode: adrress.postalCode,
      MailingCountry: adrress.country,
    }
    const url = `${URL_SALESFORCE}/services/data/v57.0/sobjects/Contact/${idClientSalesforce}`;
    try {
      const response = await http.patch(url, data);
      return response.data;
    }
    catch (error) {
      console.info('error', error)
    }
  }
}
