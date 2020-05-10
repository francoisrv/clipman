import { promisify } from 'util'
import { exec } from 'child_process'
import applyTemplate from '../helpers/applyTemplate'
import applyType from './applyType'

export async function getDefaultValue(defaultValue: any, type: any, tpl: any) {
  if (defaultValue.command) {
    const command = applyTemplate(defaultValue.command, tpl)
    const { stdout } = await promisify(exec)(command)
    return await getDefaultValue({ value: stdout.replace(/\n$/, '') }, type, {})
  }
  return applyType(type, defaultValue.value)
}