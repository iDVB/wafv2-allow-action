import {HttpClient} from '@actions/http-client'

import {getPublicIp} from '../src/utils/ipify'

describe('Public IP', () => {
  beforeAll(() => {
    jest.mock('@actions/http-client')
  })

  afterEach(() => jest.resetAllMocks())

  test('Return public ip address', async () => {
    const ip = '1.2.3.4'
    HttpClient.prototype.getJson = jest
      .fn()
      .mockResolvedValue({statusCode: 200, result: {ip}})

    const resp = await getPublicIp()

    expect(HttpClient.prototype.getJson).toHaveBeenCalled()
    expect(resp).toEqual(ip)
  })
})
