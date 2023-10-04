import type { AxiosInstance } from 'axios'

import {
  CLIENT_ID,
  CLIENT_SECRET,
  CODE_STATUS_200,
  CODE_STATUS_201,
  CODE_STATUS_204,
  GRANT_TYPE,
  PATH_API_SALESFORCE,
  PATH_CONTACT_SALESFORCE,
  PATH_QUERY_SALESFORCE,
  PATH_SALESFORCE_AUTH,
} from '../utils/constans'
import { Result } from '../schemas/Result'
import type { ClientVtexResponse } from '../schemas/ClientVtexResponse'
import type { AddressVtexResponse } from '../schemas/AddressVtexResponse'
import type { ParameterList } from '../schemas/Parameter'

export default class SalesforceClient {
  public login = async (parameterList: ParameterList, http: AxiosInstance) => {
    const clientId = parameterList.get(CLIENT_ID)
    const clientSecret = parameterList.get(CLIENT_SECRET)

    const params = new URLSearchParams()

    params.append('grant_type', GRANT_TYPE)
    params.append('client_id', clientId ?? '')
    params.append('client_secret', clientSecret ?? '')

    try {
      const response = await http.post(PATH_SALESFORCE_AUTH, params)

      if (
        response.status === CODE_STATUS_200 ||
        response.status === CODE_STATUS_201 ||
        response.status === CODE_STATUS_204
      ) {
        return Result.TaskOk(response.data)
      }

      return Result.TaskResult(
        response.status,
        'Could not login to salesforce',
        response.data
      )
    } catch (error) {
      return Result.TaskError('An error occurred while logging in')
    }
  }

  public get = async (email: string, http: AxiosInstance) => {
    const url = `${PATH_QUERY_SALESFORCE}SELECT+id,Email+FROM+Contact+WHERE+Email+=+'${email}'`

    try {
      const response = await http.get(url)

      if (
        response.status === CODE_STATUS_200 ||
        response.status === CODE_STATUS_201 ||
        response.status === CODE_STATUS_204
      ) {
        return Result.TaskOk(response.data)
      }

      return Result.TaskResult(
        response.status,
        'Client could not be queried in salesforce',
        response.data
      )
    } catch (error) {
      return Result.TaskError('An error occurred while viewing the client')
    }
  }

  public getUser = async (email: string, http: AxiosInstance) => {
    const url = `${PATH_QUERY_SALESFORCE}SELECT+id,Email+FROM+User+WHERE+Email+=+'${email}'`

    try {
      const response = await http.get(url)

      if (
        response.status === CODE_STATUS_200 ||
        response.status === CODE_STATUS_201 ||
        response.status === CODE_STATUS_204
      ) {
        return Result.TaskOk(response.data)
      }

      return Result.TaskResult(
        response.status,
        'User could not be queried in salesforce',
        response.data
      )
    } catch (error) {
      return Result.TaskError('An error occurred while viewing the user')
    }
  }

  public create = async (
    clientVtex: ClientVtexResponse,
    address: AddressVtexResponse,
    http: AxiosInstance
  ) => {
    const data = {
      FirstName: clientVtex.firstName,
      LastName: clientVtex.lastName,
      Email: clientVtex.email,
      HomePhone: clientVtex.homePhone,
      Phone: clientVtex.phone,
      Birthdate: clientVtex.birthDate,
      MailingStreet: address.street,
      MailingCity: address.city,
      MailingState: address.state,
      MailingPostalCode: address.postalCode,
      MailingCountry: address.country,
    }

    const url = `${PATH_API_SALESFORCE}${PATH_CONTACT_SALESFORCE}`

    try {
      const response = await http.post(url, data)

      if (
        response.status === CODE_STATUS_200 ||
        response.status === CODE_STATUS_201
      ) {
        return Result.TaskOk(response.data)
      }

      return Result.TaskResult(
        response.status,
        'Client could not be created in salesforce',
        response.data
      )
    } catch (error) {
      return Result.TaskError(
        'An error occurred when creating client in salesforce'
      )
    }
  }

  public update = async (
    clientVtex: ClientVtexResponse,
    address: AddressVtexResponse,
    idClientSalesforce: string,
    http: AxiosInstance
  ) => {
    const data = {
      FirstName: clientVtex.firstName,
      LastName: clientVtex.lastName,
      Email: clientVtex.email,
      HomePhone: clientVtex.homePhone,
      Phone: clientVtex.phone,
      Birthdate: clientVtex.birthDate,
      MailingStreet: address.street,
      MailingCity: address.city,
      MailingState: address.state,
      MailingPostalCode: address.postalCode,
      MailingCountry: address.country,
    }

    const url = `${PATH_API_SALESFORCE}${PATH_CONTACT_SALESFORCE}/${idClientSalesforce}`

    try {
      const response = await http.patch(url, data)

      if (
        response.status === CODE_STATUS_200 ||
        response.status === CODE_STATUS_201
      ) {
        return Result.TaskOk(response.data)
      }

      return Result.TaskResult(
        response.status,
        'Client could not be updated in salesforce',
        response.data
      )
    } catch (error) {
      return Result.TaskError(
        'An error occurred when updating client in salesforce'
      )
    }
  }
}
