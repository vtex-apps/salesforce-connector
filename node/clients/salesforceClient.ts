import { IOResponse } from '@vtex/api';
import axios from 'axios'
import qs from 'qs';
import { CLIENT_ID, CLIENT_SECRET, GRANT_TYPE, PASSWORD, PATH_API_SALESFORCE, PATH_CONTACT_SALESFORCE, URI_SALESFORCE, URI_SALESFORCE_AUTH, USERNAME } from '../utils/constans';

export default class SalesforceClient {
  public auth = async () => {
    const http = axios.create({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const url = URI_SALESFORCE_AUTH;
    const data = qs.stringify({
      grant_type: GRANT_TYPE,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      username: USERNAME,
      password: PASSWORD,
    });
    try {
      const response = await http.post(url, data);
      return response.data.access_token;
    }
    catch (error) {
      //TODO: return error response
      console.error('error', error)
    }
  }

  //TODO: Change any type
  public get = async (clientVtex: IOResponse<any>, accessToken: string) => {
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache",
        "X-Vtex-Use-Https": "true",
        'Content-Type': 'application/json'
      }
    });
    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}/query/?q=SELECT+id,Email+FROM+Contact+WHERE+Email+=+'${clientVtex.data[0].email}'`;
    try {
      const response = await http.get(url);
      return response.data;
    }
    catch (error) {
      //TODO: Improve error response
      console.error('error', error)
    }
  }

  public create = async (clientVtex: IOResponse<any>, adrress: any, accessToken: string) => {
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache",
        "X-Vtex-Use-Https": "true",
        'Content-Type': 'application/json'
      }
    });
    const data = {
      FirstName: clientVtex.data[0].firstName,
      LastName: clientVtex.data[0].lastName,
      Email: clientVtex.data[0].email,
      Phone: clientVtex.data[0].homePhone ? clientVtex.data[0].homePhone : clientVtex.data[0].phone,
      MailingStreet: adrress ? adrress.street : '',
      MailingCity: adrress ? adrress.city : '',
      MailingState: adrress ? adrress.state : '',
      MailingPostalCode: adrress ? adrress.postalCode : '',
      MailingCountry: adrress ? adrress.country : '',
    }
    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_CONTACT_SALESFORCE}`;
    try {
      const response = await http.post(url, data);
      return response.data;
    }
    catch (error) {
      console.error('error', error)
    }
  }

  public update = async (clientVtex: IOResponse<any>, adrress: any, idClientSalesforce: any, accessToken: string) => {
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache",
        "X-Vtex-Use-Https": "true",
        'Content-Type': 'application/json'
      }
    });
    const data = {
      FirstName: clientVtex.data[0].firstName,
      LastName: clientVtex.data[0].lastName,
      Email: clientVtex.data[0].email,
      Phone: clientVtex.data[0].homePhone ? clientVtex.data[0].homePhone : clientVtex.data[0].phone,
      MailingStreet: adrress ? adrress.street : '',
      MailingCity: adrress ? adrress.city : '',
      MailingState: adrress ? adrress.state : '',
      MailingPostalCode: adrress ? adrress.postalCode : '',
      MailingCountry: adrress ? adrress.country : '',
    }
    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_CONTACT_SALESFORCE}/${idClientSalesforce}`;
    try {
      const response = await http.patch(url, data);
      return response.data;
    }
    catch (error) {
      //TODO: Improve error response
      console.error('error', error)
    }
  }
}
