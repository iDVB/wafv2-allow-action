import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_ACTION'] = 'remove'
  process.env['INPUT_IPSET_ID'] = 'bd7d5f10-92e3-4e71-bcd5-81b1f71fc8ef'
  process.env['INPUT_IPSET_NAME'] = 'CodeFreshIPs'
  process.env['INPUT_IPSET_SCOPE'] = 'REGIONAL'

  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
