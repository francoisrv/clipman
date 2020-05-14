import applyType from './applyType'
import { getDefaultValue } from './getDefaultValue'
import { ClipmanInputOptions, ClipmanOptionSchema } from '../types'
import { has, set, get } from 'lodash'
import applyTemplate from './applyTemplate'
import { promisify } from 'util'
import { exec } from 'child_process'

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

export async function mergeDefaultValues(schema: ClipmanOptionSchema, options: ClipmanInputOptions): Promise<ClipmanInputOptions> {
  const nextOptions = { ...options }
  const templates: { path: string, value: string }[] = []
  
  for (const option in schema) {
    const schemaOption = schema[option]
    const { type = 'string' } = schemaOption
    if ('default' in schemaOption && !has(nextOptions, option)) {
      if ('value' in schemaOption.default) {
        if (schemaOption.default.useTemplate) {
          if (type === 'string') {
            templates.push({
              path: option,
              value: schemaOption.default.value
            })
          }
        } else {
          const nextValue = applyType(type, schemaOption.default.value)
          if (typeof nextValue !== 'undefined') {
            set(nextOptions, option, nextValue)
          }
        }
      } else if ('command' in schemaOption.default) {
        if (schemaOption.default.useTemplate) {
          if (type === 'string') {
            templates.push({
              path: option,
              value: schemaOption.default.command
            })
          }
        } else {
          const { stdout } = await promisify(exec)(schemaOption.default.command)
          const nextValue = applyType(type, stdout.replace(/\n$/, ''))
          if (typeof nextValue !== 'undefined') {
            set(nextOptions, option, nextValue)
          }
        }
      } 
    }
  }

  for (const template of templates) {
    const value = applyTemplate(template.value, { options: nextOptions })
    set(nextOptions, template.path, value)
  }
  
  return nextOptions
}

export default async function parseArgs(schema: ClipmanOptionSchema, options: ClipmanInputOptions): Promise<ClipmanInputOptions> {
  const input = parseType(schema, options)
  return mergeDefaultValues(schema, input)
}
