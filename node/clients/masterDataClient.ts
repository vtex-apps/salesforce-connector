import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import axios from 'axios'
import { ADDRESS_ENTITY_V1, ADDRESS_ENTITY_V2, CLIENT_ENTITY_V1, CLIENT_ENTITY_V2, PATH_ACTION_TRIGGER, PATH_API_DATAENTITIES, PATH_SEARCH_ID, PATH_SEARCH_USERID, TRIGGER_NAME, URI_SALESFORCE_TRIGGER } from '../utils/constans'
import { Result } from '../schemas/Result'
import { ClientVtexResponse } from '../schemas/ClientVtexResponse'
import { AddressVtexResponse } from '../schemas/AddressVtexResponse'

export default class MasterDataClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br${PATH_API_DATAENTITIES}`,
      context,
      {
        ...options,
        headers: {
          VtexIdClientAutCookie:
            context.adminUserAuthToken ??
            context.storeUserAuthToken ??
            context.authToken,
        },
      }
    )
  }

  public async getClient(clientId: string, version: string) {
    const path = version === 'V1' ? `${CLIENT_ENTITY_V1}${PATH_SEARCH_USERID}${clientId}` : `${CLIENT_ENTITY_V2}${PATH_SEARCH_ID}${clientId}`;
    const response = await this.http.getRaw(path)
    const clientVtexResponse: ClientVtexResponse = {
      id: response.data[0].id,
      homePhone: response.data[0].homePhone,
      phone: response.data[0].phone,
      document: response.data[0].document,
      email: response.data[0].email,
      firstName: response.data[0].firstName,
      lastName: response.data[0].lastName,
    }
    return clientVtexResponse
  }

  public async getAddresses(clientId: string, version: string) {
    const path = version === 'V1' ? `${ADDRESS_ENTITY_V1}${PATH_SEARCH_USERID}${clientId}` : `${ADDRESS_ENTITY_V2}${PATH_SEARCH_ID}${clientId}`;
    const response = await this.http.getRaw(path)
    const addressVtexResponse: AddressVtexResponse = {
      street: response.data[0].street,
      city: response.data[0].city,
      state: response.data[0].state,
      postalCode: response.data[0].postalCode,
      country: response.data[0].country,
    }
    return addressVtexResponse;
  }

  public async createTrigger() {
    const result = new Result();
    const endpoint = `http://${this.context.account}.myvtex.com${PATH_API_DATAENTITIES}/${CLIENT_ENTITY_V2}/schemas/${TRIGGER_NAME}`;
    const triggerConfig = {
      "properties": {
        "document": {
          "type": "string"
        },
        "address": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "phone": {
          "type": "string"
        },
        "email": {
          "type": "string"
        }
      },
      "v-triggers": [
        {
          "name": "trigger-test-http",
          "active": true,
          "condition": "id<>00000000",
          "action": {
            "type": "http",
            "uri": `${URI_SALESFORCE_TRIGGER}${PATH_ACTION_TRIGGER}`,
            "method": "POST",
            "headers": {
              "content-type": "application/json"
            },
            "body": {
              "id": "{!id}",
              "version": "V2"
            }
          },
          "retry": {
            "times": 5,
            "delay": {
              "addMinutes": 30
            }
          }
        }
      ]
    }
    try {
      const response = await axios.put(endpoint, triggerConfig, {
        headers: {
          VtexIdClientAutCookie:
          this.context.adminUserAuthToken ??
          this.context.storeUserAuthToken ??
          this.context.authToken,
          'Content-Type': 'application/json',
        },
      });
      result.ok(response.data);
      return result;
    } catch (error) {
      result.error('Error creando el trigger:', error);
      return result;
    }
  }
}
