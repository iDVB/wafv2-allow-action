# Public IP

> Queries the runner's public IP address using [ipify](https://www.ipify.org/) and then adds/removes it to the desired AWS WAF2 IPSet 

### Motivation
GitHub actions shared runners are hosted in **Azure** (Windows & Linux) and **Mac Stadium** for macOS, so whitelisting all these infrastructures can be difficult and needs to be updated quite often. Instead, you can use this action to temporaraly update an [AWS WAF](https://aws.amazon.com/waf/) (v2) IPSet in order to whitelist the runner's public IP and run integration, lighthouse or other related tasks. You can then use cleanup by running this action again to remove that IP.

[GitHub Help](https://help.github.com/en/actions/reference/virtual-environments-for-github-hosted-runners)

## Usage

### Inputs
* `action` - `add` or `remove` the runner's IP
* `ipset_id` - ID of the IPSet
* `ipset_name` - name of the IPSet
* `ipset_scope` - `REGIONAL` or `CLOUDFRONT`
* `maxRetries` - How many retries on the ipify API before failing. Default: `10`
* `region` - AWS Region to act on.

## Required ENVs
AWS Credientials must be provided to step.
* `AWS_ACCESS_KEY_ID` - AWS Key ID
* `AWS_SECRET_ACCESS_KEY` - AWS Access Key
* `AWS_DEFAULT_REGION` (optional) - This will be used if `region` input is not provided.


### Outputs
* `address` - (add only) 


### Example workflow
```yaml
name: WAFV2 Allow Action

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      AWS_DEFAULT_REGION: us-east-1
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.SECRET_ACCESS_KEY }}

    steps:
    - name: Add Public IP to Allow
      uses: iDVB/wafv2-allow-action@latest
      with:
        action: add
        ipset_id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        ipset_name: MyExistingIPSet
        ipset_scope: REGIONAL

    - name: Audit Now-Allowed Site using Lighthouse
      uses: treosh/lighthouse-ci-action@v7
      with:
        urls: |
          https://example.com/
        budgetPath: ./budget.json

    - name: Remove Public IP from Allow
      uses: iDVB/wafv2-allow-action@latest
      with:
        action: remove
        ipset_id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        ipset_name: MyExistingIPSet
        ipset_scope: REGIONAL
```

## Contributing
Please contribute to `iDVB/wafv2-allow-action`, pull requests are welcome!

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)

## Credits
* [haythem/public-ip](https://github.com/haythem/public-ip)
* [GitHub Actions Typscript Boilerplate](https://github.com/actions/typescript-action)