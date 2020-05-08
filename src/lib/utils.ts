import { promisify } from 'util'
import { readFile } from 'fs'
import { exec } from 'child_process'
import { template } from 'lodash'
import applyTemplate from './applyTemplate'

export async function getJson<T = any>(file: string): Promise<T> {
  const content = await promisify(readFile)(file)
  const source = content.toString()
  return JSON.parse(source)
}

export async function getDefaultValue(defaultValue: any, type: any, tpl: any) {
  if (defaultValue.command) {
    const command = applyTemplate(defaultValue.command, tpl)
    const { stdout } = await promisify(exec)(command)
    return await getDefaultValue({ value: stdout.replace(/\n$/, '') }, type, {})
  }
  return applyType(type, defaultValue.value)
}

export async function applyType(type: any, value: any) {
  switch (type) {
    case 'string':
    default: return value.toString()
    case 'number': return Number(value)
  }
}
