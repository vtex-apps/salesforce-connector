import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import axios from 'axios'
import { ADDRESS_ENTITY_V1, ADDRESS_ENTITY_V2, CLIENT_ENTITY_V1, CLIENT_ENTITY_V2, PATH_ACTION_TRIGGER, PATH_API_DATAENTITIES, PATH_SEARCH_ID, PATH_SEARCH_USERID, TRIGGER_NAME } from '../utils/constans'

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
    //TODO: use ternary operator
    if (version === 'V1') {
      return this.http.getRaw(`${CLIENT_ENTITY_V1}${PATH_SEARCH_USERID}${clientId}`)
    } else {
      return this.http.getRaw(`${CLIENT_ENTITY_V2}${PATH_SEARCH_ID}${clientId}`)
    }
  }

  public async getAddresses(clientId: string, version: string) {
    //TODO: use ternary operator
    if (version === 'V1') {
      return this.http.getRaw(`${ADDRESS_ENTITY_V1}${PATH_SEARCH_USERID}${clientId}`)
    } else {
      return this.http.getRaw(`${ADDRESS_ENTITY_V2}${PATH_SEARCH_ID}${clientId}`)
    }
  }

  public async createTrigger() {
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
            "uri": `https://salesforce--felipedev.myvtex.com${PATH_ACTION_TRIGGER}`, //TODO: Change the hard-coded URL for something generic.
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

      return response.data;
    } catch (error) {
      console.error('Error creating trigger:', error);
      // TODO: return with appropriate error message and error code
    }
  }
}
