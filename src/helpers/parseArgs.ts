import applyType from './applyType'
import { getDefaultValue } from './getDefaultValue'
import { ClipmanInputOptions, ClipmanOptionSchema } from '../types'

export function parseType(optionSchema: ClipmanOptionSchema, options: ClipmanInputOptions): ClipmanInputOptions {
  const params: ClipmanInputOptions = {}
  for (const option in optionSchema) {
    if (option in options) {
      params[option] = applyType(optionSchema[option].type || 'string', options[option])
    }
  }
  return params
}

export async function parseDefault(optionSchema: ClipmanOptionSchema, options: ClipmanInputOptions): Promise<ClipmanInputOptions> {
  const params: ClipmanInputOptions = {}
  for (const option in optionSchema) {
    if ('default' in optionSchema[option] && !(option in params) && !optionSchema[option].useTemplate) {
      params[option] = await getDefaultValue(optionSchema[option].default, optionSchema[option].type || 'string', { options: params })
    } else {
      params[option] = optionSchema[option]
    }
  }
  return params
}

export async function parseDefaultTemplate(optionSchema: ClipmanOptionSchema, options: ClipmanInputOptions): Promise<ClipmanInputOptions> {
  const params: ClipmanInputOptions = {}
  for (const option in optionSchema) {
    if ('default' in optionSchema[option] && !(option in params) && optionSchema[option].useTemplate) {
      params[option] = await getDefaultValue(optionSchema[option].default, optionSchema[option].type || 'string', { options: params })
    } else {
      params[option] = optionSchema[option]
    }
  }
  return params
}

export default async function parseArgs(optionSchema: ClipmanOptionSchema, options: ClipmanInputOptions): Promise<ClipmanInputOptions> {
  const withInput = parseType(optionSchema, options)
  const withDefault = await parseDefault(optionSchema, { ...withInput })
  const withDefaultTemplate = parseDefaultTemplate(optionSchema, withDefault)
  
  return withDefaultTemplate
}
