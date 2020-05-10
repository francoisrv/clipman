import { promisify } from 'util'
import { readFile } from 'fs'

export default async function getJson<T = any>(file: string): Promise<T> {
  const content = await promisify(readFile)(file)
  const source = content.toString()
  return JSON.parse(source)
}