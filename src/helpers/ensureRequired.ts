import applyTemplate from "./applyTemplate"
import { ClipmanOptionSchema, ClipmanInputOptions } from "../types"
import { has } from "lodash"

export default function ensureRequired(schema: ClipmanOptionSchema, options: ClipmanInputOptions) {
  for (const field in schema) {
    const attr = schema[field]
    if (attr.required && !has(options, field)) {
      if (attr.required === true) {
        throw new Error(`Missing required option: ${ field }`)
      }
      if (attr.required.if) {
        const tpl = `<% if (${ attr.required.if }) { %>OK<% } %>`
        const output = applyTemplate(tpl, { options: options })
        if (output === 'OK') {
          throw new Error(`Missing required option: ${ field }`)
        }
      }
    }
  }
}