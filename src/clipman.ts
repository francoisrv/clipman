import run from './lib/run'

async function clipr() {
  const [,, command, ...args] = process.argv

  if (!command) {
    throw new Error('Missing command')
  }
  switch (command) {
    default: throw new Error(`Unknwon command: ${ command }`)
    case 'run': {
      const app = args.shift() as string
      const res = await run(app, ...args)
      console.log(res)
    } break
  }
}

clipr()