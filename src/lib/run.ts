import { join, dirname } from 'path'
import { spawn } from 'child_process'
import clipop from 'clipop'
import colors from 'colors'
import { compact, isEmpty, some } from 'lodash'
import shortid from 'shortid'

import { ClipmanOptions } from '../types'
import { getJson } from './utils'
import help, { usage } from './help'
import parseArgs from './parseArgs'
import { promisify } from 'util'
import { readFile, stat } from 'fs'

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
    
    const entry = /^\//.test(app) ? app : join(process.cwd(), app)
    let file = entry
    const stats = await promisify(stat)(entry)
    if (stats.isDirectory()) {
      file = join(entry, 'clipman.json')
      await promisify(stat)(file)
    }
    const base = dirname(file)
    const cliprJson = await getJson(file)
    const options = clipop<ClipmanOptions>(...args)
  
    ctx = findContext(cliprJson, ...args)
    
    if (options.help) {
      return await help(ctx)
    }

    if (!ctx.entry) {
      if (!isEmpty(ctx.commands)) {
        throw new Error('Missing command')
      }
      return ''
    }
  
    const params = await parseArgs(ctx.options, options)

    const tmp = `/tmp/clipman-${ shortid.generate() }.json`

    const clipmanOptions = {
      arguments: args
    }

    return new Promise((resolve, reject) => {
      const ps = spawn(
        'node',
        [
          '-e',
          `
          const { promisify } = require('util')
          const { writeFile } = require('fs')
          
          async function run() {
            const file = '${ join(base, ctx.entry) }'
            const imported = require(file)
            const fn = imported.default || imported
            const options = JSON.parse('${ JSON.stringify(params) }')
            const clipmanOptions = JSON.parse('${ JSON.stringify(clipmanOptions) }')
            try {
              const res = await fn(options, clipmanOptions)
              await promisify(writeFile)(
                '${ tmp }',
                typeof res === 'undefined' ? '""' : JSON.stringify(res)
              )
            } catch (error) {
              console.log(error)
              await promisify(writeFile)('${ tmp }', JSON.stringify({
                '!!!clipmanError!!!': {
                  ...error,
                  stack: error.stack,
                  message: error.message
                }
              }))
              process.exit(1)
            }
          }

          run()
          `
        ],
        {
          cwd: base
        }
      )
      ps.stdout.on('data', data => {
        console.log(data.toString())
      })
      ps.stderr.on('data', data => {
        console.log(colors.italic.grey(data.toString()))
      })
      ps.on('close', async (status) => {
        let response: Buffer | null = null
        let res: any = null
        try {
          response = await promisify(readFile)(tmp)
        } catch (error) {
          if (status !== 0) {
            reject(new Error(`Command failed with status ${ status } and response was not saved`))
            return
          }
        }
        if (response) {
          try {
            res = JSON.parse(response.toString())
          } catch (error) {
            if (status === 0) {
              resolve('')
              return
            }
            reject(new Error(`Command failed with status ${ status } and response was not parsed`))
            return
          }
        }
        if (res) {
          if (status === 0) {
            resolve(res)
          } else if (res['!!!clipmanError!!!']) {
            reject(new Error(res['!!!clipmanError!!!'].message))
          } else {
            reject(new Error(`Command failed with status ${ status }`))
          }
        }
      })
      ps.on('error', reject)
    })
  } catch (error) {
    const regexes: (RegExp | string)[] = [
      /^Missing required option: /,
      'Command ran ok but response could not be saved'
    ]
    const conditions: boolean[] = regexes.map(r => {
      if (typeof r === 'string') {
        return error.message === r
      }
      if (r instanceof RegExp) {
        return r.test(error.message)
      }
      return false
    })
    if (some(conditions)) {
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