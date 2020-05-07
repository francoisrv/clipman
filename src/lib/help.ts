import { isEmpty, omit, compact, repeat } from 'lodash'
import colors from 'colors'
import { promisify } from 'util'
import { exec } from 'child_process'

export function header(options: any) {
  const parts: string[] = [
    colors.bold.underline(options.name),
    `v${ options.version }`
  ]
  if (options.description) {
    parts.push(` | ${ options.description }`)
  }
  return parts.join(' ')
}

export function usage(options: any): string {
  if (!isEmpty(options.commands)) {
    const usages: string[] = []
    for (const command in options.commands) {
      usages.push(usage({ ...options.commands[command], name: `${ options.name } ${ command }` }))
    }
    return usages.join('\n')
  }
  return `${ options.name } ${ isEmpty(options.options) ? '' : '<options>' }`
}

export async function showOptions(options: any): Promise<string> {
  if (!options || isEmpty(options)) {
    return ''
  }
  const parts: string[][] = []
  for (const option in options) {
    const {
      type = 'string',
      description = '---',
      required = false,
      default: defaultValue
    } = options[option]
    const more: string[] = []
    if (required === true) {
      more.push(colors.yellow('required'))
    } else if (required.if) {
      more.push(colors.yellow('required'), `if ${ required.if }`)
    } else {
      more.push('optional')
    }
    if (defaultValue) {
      if ('value' in defaultValue) {
        more.push(`default: ${ colors.magenta(JSON.stringify(defaultValue.value)) }`)
      } else if ('command' in defaultValue) {
        const { stdout } = await promisify(exec)(defaultValue.command)
        more.push(`default: ${ colors.magenta(`"${ stdout.trim() }"`) }`)
      }
    }
    parts.push(compact([option, type, description, more.length && `(${ more.join(', ') })`]))
  }
  let optionPadding = 0
  let typePadding = 0
  for (const part of parts) {
    const [option, type] = part
    const optionLength = option.length
    const typeLength = type.length
    if (optionLength > optionPadding) {
      optionPadding = optionLength + 8
    }
    if (typeLength > typePadding) {
      typePadding = typeLength + 5
    }
  }
  const joinInner = ([option, type, description, more]) => [
    '--',
    option,
    repeat(' ', optionPadding - option.length),
    colors.grey(type),
    repeat(' ', typePadding - type.length),
    description,
    ' ',
    more
  ].join('')
  return `* Options\n\n${ parts.map(joinInner).join('\n') }`
}

export default async function help(options: any) {
  const parts: string[] = compact([
    header(options),
    '* Usage',
    usage(options),
    await showOptions(options.options),
    colors.grey.italic('made with clipman')
  ])
  return parts.join('\n\n')
}
