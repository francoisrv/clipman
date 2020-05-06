#! /usr/bin/env node
import run from './lib/run'
import colors from 'colors'
import init from './lib/init'

function fail(message: string, stack = '') {
  console.log(colors.red(message))
  console.log(colors.yellow(stack))
  process.exit(1)
}

async function clipman() {
  const [,, command, ...args] = process.argv

  if (!command) {
    fail('Missing command')
  }
  
  switch (command) {
    default: {
      fail((`Unknwon command: ${ command }`))
    } break
    case 'run': {
      const app = args.shift() as string
      const res = await run(app, ...args)
      console.log(res)
    } break
    case 'init': {
      const app = args.shift() || process.cwd()
      const res = await init(app)
      console.log(res)
    } break
    case 'help': {
      
    } break
  }
}

clipman()
  .catch(error => {
    fail(error.message, error.stack)
  })