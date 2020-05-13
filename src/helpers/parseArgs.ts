import applyType from './applyType'
import { getDefaultValue } from './getDefaultValue'
import { ClipmanInputOptions, ClipmanOptionSchema } from '../types'
import { has, set, get } from 'lodash'

export function parseType(schema: ClipmanOptionSchema, options: ClipmanInputOptions): ClipmanInputOptions {
  const params: ClipmanInputOptions = {}
  for (const option in schema) {
    if (has(options, option)) {
      const value = get(options, option)
      set(params, option, applyType(schema[option].type || 'string', value))
    }
  }
  return params
}

export async function parseDefault(schema: ClipmanOptionSchema, options: ClipmanInputOptions): Promise<ClipmanInputOptions> {
  const params: ClipmanInputOptions = {}
  
  for (const option in schema) {
    const schemaOption = schema[option]
    const optionValue = get(options, option)
    const { type = 'string' } = schemaOption
    if (
      'default' in schemaOption &&
      typeof optionValue === 'undefined' &&
      !schemaOption.useTemplate
    ) {
      const value = await getDefaultValue(schemaOption.default, type, {
        options: params
      })
      set(params, option, value)
    } else {
      set(params, option, optionValue)
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
