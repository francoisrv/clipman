import applyTemplate from "./applyTemplate"

export default function ensureRequired(config: any, params: any) {
  for (const option in config) {
    if (config[option].required && !(option in params)) {
      if (config[option].required === true) {
        throw new Error(`Missing required option: ${ option }`)
      }
      if (config[option].required.if) {
        const tpl = `<% if (${ config[option].required.if }) { %>OK<% } %>`
        const output = applyTemplate(tpl, { options: params })
        if (output === 'OK') {
          throw new Error(`Missing required option: ${ option }`)
        }
      }
    }
  }
}