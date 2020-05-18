import { join, dirname } from 'path'
import { spawn, exec } from 'child_process'
import clipop from 'clipop'
import colors from 'colors'
import { compact, isEmpty, some } from 'lodash'
import shortid from 'shortid'
import { promisify } from 'util'
import { readFile, stat } from 'fs'

import { ClipmanInputOptions } from '../types'
import help, { usage } from './help'
import getJson from '../helpers/getJson'
import findContext from '../helpers/findContext'
import parseArgs from '../helpers/parseArgs'
import ensureRequired from '../helpers/ensureRequired'
import applyTemplate from '../helpers/applyTemplate'

export default async function run(app: string, ...args: string[]) {
  let ctx: any
  try {
    if (!app) {
      throw new Error('Missing app')
    }
    
    const entry = /^\//.test(app) ? app : join(process.cwd(), app)
    let file = entry
    const create = async () => {
      file = join(entry, 'clipman.json')
      await promisify(stat)(file)
    }
    try {
      const stats = await promisify(stat)(entry)
      if (stats.isDirectory()) {
        await create()
      }
    } catch (error) {
      await create()
    }
    const base = dirname(file)
    const cliprJson = await getJson(file)
    const options = clipop<ClipmanInputOptions>(...args)
  
    ctx = findContext(cliprJson, ...args)
    
    if (options.help) {
      return await help(ctx)
    }
  
    const params = await parseArgs(ctx.options, options)

    ensureRequired(ctx.options, params)

    if (ctx.command) {
      try {
        const { stdout } = await promisify(exec)(applyTemplate(ctx.command, params))
        console.log(stdout)
      } catch (error) {
        console.log(error.stdout)
        process.exit(1)
      }
    } else {
      if (!ctx.entry) {
        if (!isEmpty(ctx.commands)) {
          throw new Error('Missing command')
        }
        return ''
      }
      
      const tmp = `/tmp/clipman-${ shortid.generate() }.json`

      const clipmanOptions = {
        arguments: args,
      }

      const execArgs = [
        join(base, ctx.entry),
        JSON.stringify(params),
        JSON.stringify(clipmanOptions),
        tmp
      ]

      return new Promise((resolve, reject) => {
        const ps = spawn(
          'node',
          [join(__dirname, 'execCommand'), ...execArgs],
          // { cwd: base }
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
              if (res.error) {
                let err = new Error(res.error.message)
                for (const key in res.error) {
                  err[key] = res.error[key]
                }
                reject(err)
              } else {
                resolve(res.response)
              }
            } else {
              if (res.error) {
                let err = new Error(res.error.message)
                for (const key in res.error) {
                  err[key] = res.error[key]
                }
                reject(err)
              } else {
                reject(new Error(`Command failed with status ${ status }`))
              }
            }
          }
        })
        ps.on('error', reject)
      })
    }
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