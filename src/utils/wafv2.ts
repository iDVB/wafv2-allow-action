import AWS from 'aws-sdk'
import {without as _without} from 'lodash'

let wafv2: AWS.WAFV2

export async function addIP(
  AddAddress: string,
  IPSetParams: AWS.WAFV2.GetIPSetRequest,
  region: string
): Promise<void> {
  wafv2 = new AWS.WAFV2({apiVersion: '2019-07-29', region})
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

export async function removeIP(
  RemoveAddress: string,
  IPSetParams: AWS.WAFV2.GetIPSetRequest,
  region: string
): Promise<void> {
  wafv2 = new AWS.WAFV2({apiVersion: '2019-07-29', region})
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
