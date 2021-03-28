import * as core from '@actions/core'
import AWS from 'aws-sdk'

import {addIP, removeIP} from './utils/wafv2'
import {getPublicIp} from './utils/ipify'

export async function run(): Promise<void> {
  try {
    const maxRetries: number = parseInt(core.getInput('maxRetries'), 10) || 10
    const action: string = core.getInput('action') || 'add'
    const region: string = core.getInput('region') || 'us-east-1'

    const IPSetInputs = getIPSetFromInputs()
    const publicIp = await getPublicIp(maxRetries)

    const NewAddress = `${publicIp}/32`

    if (action === 'add') {
      await addIP(NewAddress, IPSetInputs, region)
    } else if (action === 'remove') {
      await removeIP(NewAddress, IPSetInputs, region)
    }

    core.setOutput('address', NewAddress)
  } catch (error) {
    core.setFailed(error.message)
  }
}

export interface IPResponse {
  ip: string
}

function getIPSetFromInputs(): AWS.WAFV2.GetIPSetRequest {
  const Id: string = core.getInput('ipset_id')
  const Name: string = core.getInput('ipset_name')
  const Scope: string = core.getInput('ipset_scope')
  return {Id, Name, Scope}
}

run()
