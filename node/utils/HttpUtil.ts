import type { AxiosInstance } from 'axios'
import axios from 'axios'

import type { ParameterList } from '../schemas/Parameter'
import { ACCOUNT_SALESFORCE, DOMAIN_SALESFORCE, PROTOCOL } from './constans'

export async function getHttpToken(
  parameterList: ParameterList,
  token: string
): Promise<AxiosInstance> {
  return axios.create({
    baseURL: `${PROTOCOL}${parameterList.get(
      ACCOUNT_SALESFORCE
    )}${DOMAIN_SALESFORCE}`,
    validateStatus: () => true,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function getHttpVTX(token: string): Promise<AxiosInstance> {
  return axios.create({
    validateStatus: () => true,
    headers: {
      VtexIdclientAutCookie: token,
      'Cache-Control': 'no-cache',
      'X-Vtex-Use-Https': 'true',
    },
  })
}

export async function getSoapToken(
  parameterList: ParameterList,
  token: string
): Promise<AxiosInstance> {
  return axios.create({
    baseURL: `${PROTOCOL}${parameterList.get(
      ACCOUNT_SALESFORCE
    )}${DOMAIN_SALESFORCE}`,
    validateStatus: () => true,
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'text/xml',
      SOAPAction: '""',
    },
  })
}
