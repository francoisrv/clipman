import { promisify } from 'util'
import { exec } from 'child_process'

import applyTemplate from '../helpers/applyTemplate'
import { ClipmanDefaultOption } from '../types'

export async function getDefaultValue(schema: ClipmanDefaultOption, vars?: object) {
  if ('command' in schema) {
    const command = schema.useTemplate ? applyTemplate(schema.command, vars) : schema.command
    const { stdout } = await promisify(exec)(command)
    return await getDefaultValue({ value: stdout.replace(/\n$/, '') })
  }
  const value = schema.useTemplate && typeof schema.value === 'string' ? applyTemplate(schema.value, vars) : schema.value
  return value
}