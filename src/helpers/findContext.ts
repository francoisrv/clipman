export default function findContext(options: any, ...args: string[]) {
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