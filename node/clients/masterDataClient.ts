import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import { AxiosInstance } from 'axios'
import { ADDRESS_ENTITY_V1, ADDRESS_ENTITY_V2, CLIENT_ENTITY_V1, CLIENT_ENTITY_V2, CODE_STATUS_200, CODE_STATUS_201, CODE_STATUS_204, CODE_STATUS_500, PATH_ACTION_TRIGGER, PATH_API_DATAENTITIES, PATH_SEARCH_ID, PATH_SEARCH_USERID, TRIGGER_NAME, WORKSPACE_VTEX } from '../utils/constans'
import { Result } from '../schemas/Result'
import { ClientVtexResponse } from '../schemas/ClientVtexResponse'

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
      birthDate: response.data[0].birthDate,
    }
    return clientVtexResponse
  }

  public async getAddresses(clientId: string, version: string) {
    const path = version === 'V1' ? `${ADDRESS_ENTITY_V1}${PATH_SEARCH_USERID}${clientId}` : `${ADDRESS_ENTITY_V2}${PATH_SEARCH_ID}${clientId}`;
    const response = await this.http.getRaw(path)
    if (response.data.length === 0) {
      return {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      }
    }
    return {
      street: response.data[0].street,
      city: response.data[0].city,
      state: response.data[0].state,
      postalCode: response.data[0].postalCode,
      country: response.data[0].country,
    }
  }

  public async createTrigger(http: AxiosInstance) {
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
            "uri": `https://${WORKSPACE_VTEX}${this.context.account}.myvtex.com${PATH_ACTION_TRIGGER}`,
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
      const response = await http.put(endpoint, triggerConfig);
      if (response.status == CODE_STATUS_200 || response.status == CODE_STATUS_201 || response.status == CODE_STATUS_204) {
        return Result.TaskOk("Trigger created or updated successfully");
      } else {
        return Result.TaskOk("Trigger was already created in MTDT and had no modifications");
      }
    } catch (error) {
      return Result.TaskResult(CODE_STATUS_500, 'Error creating the trigger', error);
    }
  }
}
