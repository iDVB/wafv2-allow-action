import {HttpClient} from '@actions/http-client'

/**
 * IPify Response.
 *
 * @see https://www.ipify.org/
 */
export interface IPResponse {
  ip: string
}

export async function getPublicIp(
  maxRetries = 10
): Promise<string | undefined> {
  const http = new HttpClient('haythem/public-ip', undefined, {
    allowRetries: true,
    maxRetries
  })
  const ipv4 = await http.getJson<IPResponse>(
    'https://api.ipify.org?format=json'
  )
  const ip = ipv4?.result?.ip
  if (!ip) throw new Error(`Can't Determine public IP`)

  return ip
}
