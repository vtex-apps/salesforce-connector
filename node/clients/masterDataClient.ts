import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import axios from 'axios'
import { ENTITY_NAME, PATH_ACTION_TRIGGER, PATH_API_DATAENTITIES, PATH_SEARCH_USERID, TRIGGER_NAME } from '../utils/constans'

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

  public async getClient(clientId: string) {
    return this.http.getRaw(`CL${PATH_SEARCH_USERID}${clientId}`)
  }

  public async getAddresses(clientId: string) {
    return this.http.getRaw(`AD${PATH_SEARCH_USERID}${clientId}`)
  }

  public async createTrigger() {
    const endpoint = `http://${this.context.account}.myvtex.com${PATH_API_DATAENTITIES}/${ENTITY_NAME}/schemas/${TRIGGER_NAME}`;

    const triggerConfig = {
      "properties": {
        "name": {
          "type": "string"
        }
      },
      "v-triggers": [
        {
          "name": "trigger-test-http",
          "active": true,
          "condition": "document=123456789",
          "action": {
            "type": "http",
            "uri": `https://salesforce--felipedev.myvtex.com${PATH_ACTION_TRIGGER}`,
            "method": "POST",
            "headers": {
              "content-type": "application/json"
            },
            "body": {
              "id": "{!id}",
              "test": "TestValue",
              "count": 25
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
    }
  }
}
