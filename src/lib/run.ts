import { CliprOptions } from '../types'
import { join, dirname } from 'path'
import { promisify } from 'util'
import { readFile } from 'fs'
import { spawn } from 'child_process'
import { getJson } from './utils'
import help, { usage } from './help'
import clipop from 'clipop'
import parseArgs from './parseArgs'
import colors from 'colors'
import { compact } from 'lodash'

function findContext(options: any, ...args: string[]) {
  if (options.commands) {
    const nextArgs = [...args]
    const command = nextArgs.shift()
    if (command && command in options.commands) {
      return findContext(
        {
          name: `${ options.name } ${ command }`,
          version: options.version,
          ...options.commands[command],
        },
        ...nextArgs
      )
    }
  }
  return options
}

export default async function run(app: string, ...args: string[]) {
  let ctx: any
  try {
    if (!app) {
      throw new Error('Missing app')
    }
    
    const file = /^\//.test(app) ? app : join(process.cwd(), app)
    const base = dirname(file)
    const cliprJson = await getJson(file)
    const options = clipop<CliprOptions>(...args)
  
    ctx = findContext(cliprJson, ...args)
    
    if (options.help) {
      return await help(ctx)
    }
  
    const params = await parseArgs(ctx.options, options)
  
    return new Promise((resolve, reject) => {
      const ps = spawn(
        'node',
        [
          '-e',
          `
          const file = '${ join(base, ctx.entry) }'
          const imported = require(file)
          const fn = imported.default || imported
          const options = JSON.parse('${ JSON.stringify(params) }')
          const res = fn(options)
          console.log(JSON.stringify(res))
          `
        ],
        {
          cwd: base
        }
      )
      const res: string[] = []
      ps.stdout.on('data', data => {
        res.push(data.toString())
      })
      ps.on('close', () => {
        const response = res.join('')
        resolve(JSON.parse(response))
      })
      ps.on('error', reject)
    })
  } catch (error) {
    if (/^Missing required option: /.test(error.message)) {
      return compact([
        colors.red(error.message),
        ' ',
        ' ',
        ctx && `* Usage: ${ usage(ctx) }`,
        ' ',
        colors.grey(`Type ${ ctx.name } --help for more info`)
      ]).join('\n')
    }
    throw error
  }
}