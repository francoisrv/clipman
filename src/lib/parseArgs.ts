import { getDefaultValue } from "./utils"
import { template } from "lodash"

export default async function parseArgs(config: any, options: any) {
  const params: any = {}
  for (const option in config) {
    if (option in options) {
      params[option] = options[option]
    } else if ('default' in config[option]) {
      params[option] = await getDefaultValue(config[option].default)
    }
  }
  for (const option in config) {
    if (config[option].required && !(option in params)) {
      if (config[option].required === true) {
        throw new Error(`Missing required option: ${ option }`)
      }
      if (config[option].required.if) {
        const tpl = `<% if (${ config[option].required.if }) { %>OK<% } %>`
        const output = template(tpl)({ options: params })
        if (output === 'OK') {
          throw new Error(`Missing required option: ${ option }`)
        }
      }
    }
  }
  return params
}
