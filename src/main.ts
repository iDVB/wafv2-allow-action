import * as core from '@actions/core'
// import {wait} from './wait'
import AWS from 'aws-sdk'
import {HttpClient} from '@actions/http-client'
import {without as _without} from 'lodash'

let wafv2: AWS.WAFV2

type IPSetInfo = {
  Id: string
  Name: string
  Scope: string
}

/**
 * IPify Response.
 *
 * @see https://www.ipify.org/
 */
interface IPResponse {
  ip: string
}

async function run(): Promise<void> {
  try {
    const action: string = core.getInput('action') || 'add'
    const region: string = core.getInput('region') || 'us-east-1'
    wafv2 = new AWS.WAFV2({apiVersion: '2019-07-29', region})

    const IPSetInputs = getIPSetFromInputs()
    const myIp = await getMyIp()
    const NewAddress = `${myIp}/32`

    if (action === 'add') {
      await addIP(NewAddress, IPSetInputs)
    } else if (action === 'remove') {
      await removeIP(NewAddress, IPSetInputs)
    }

    core.setOutput('address', NewAddress)
  } catch (error) {
    core.setFailed(error.message)
  }
}

const getMyIp = async (): Promise<string> => {
  const http = new HttpClient('haythem/public-ip', undefined, {
    allowRetries: true,
    maxRetries: 10
  })
  const ipv4 = await http.getJson<IPResponse>(
    'https://api.ipify.org?format=json'
  )
  const ip = ipv4?.result?.ip
  if (!ip) throw new Error(`Can't Determine runner IP`)

  core.info(`ipv4: ${ip}`)
  return ip
}

const getIPSetFromInputs = (): IPSetInfo => {
  const Id: string = core.getInput('ipset_id')
  const Name: string = core.getInput('ipset_name')
  const Scope: string = core.getInput('ipset_scope')

  return {Id, Name, Scope}
}

const addIP = async (
  AddAddress: string,
  IPSetParams: IPSetInfo
): Promise<void> => {
  const {IPSet, LockToken} = await wafv2.getIPSet(IPSetParams).promise()
  if (!IPSet || !LockToken) throw new Error('IPSet and/or LockToken Not Found.')

  const {Addresses: CurrentAddresses} = IPSet
  const Addresses = [...CurrentAddresses, AddAddress]

  await wafv2
    .updateIPSet({
      Addresses,
      LockToken,
      ...IPSetParams
    })
    .promise()
}

const removeIP = async (
  RemoveAddress: string,
  IPSetParams: IPSetInfo
): Promise<void> => {
  const {IPSet, LockToken} = await wafv2.getIPSet(IPSetParams).promise()
  if (!IPSet || !LockToken) throw new Error('IPSet and/or LockToken Not Found.')

  const {Addresses: CurrentAddresses} = IPSet
  const Addresses = _without(CurrentAddresses, RemoveAddress)

  await wafv2
    .updateIPSet({
      Addresses,
      LockToken,
      ...IPSetParams
    })
    .promise()
}

run()
