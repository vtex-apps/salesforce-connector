import axios, { AxiosInstance } from 'axios'

export async function getHttpToken(token: string): Promise<AxiosInstance> {
    return axios.create({
        validateStatus: () => true,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
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