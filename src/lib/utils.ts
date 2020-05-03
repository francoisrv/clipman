import { promisify } from 'util'
import { readFile } from 'fs'
import { exec } from 'child_process'

export async function getJson<T = any>(file: string): Promise<T> {
  const content = await promisify(readFile)(file)
  const source = content.toString()
  return JSON.parse(source)
}

export async function getDefaultValue(defaultValue: any) {
  if (defaultValue.command) {
    const { stdout } = await promisify(exec)(defaultValue.command)
    return stdout.replace(/\n$/, '')
  }
  return defaultValue.value
}
