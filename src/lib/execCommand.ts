import { promisify } from 'util'
import { writeFile } from 'fs'
import { ClipmanResults } from '../types'

async function execCommand(
  entry: string,
  options: string,
  clipmanOptions: string,
  target: string
) {
  const imported = require(entry)
  const fn = imported.default || imported
  const content: ClipmanResults = {
    entry,
    options: JSON.parse(options),
    arguments: JSON.parse(clipmanOptions).arguments,
    response: null
  }
  try {
    if (typeof fn !== 'function') {
      throw new Error('Command is not a function')
    }
    const res = await fn(JSON.parse(options), JSON.parse(clipmanOptions))
    content.response = typeof res === 'undefined' ? '' : res
  } catch (error) {
    content.error = {
      ...error,
      stack: error.stack,
      message: error.message
    }
  } finally {
    await promisify(writeFile)(
      target,
      JSON.stringify(content, null, 2)
    )
  }
}

const  [,, entry, options, clipmanOptions, target] = process.argv

execCommand(entry, options, clipmanOptions, target)
  .then(() => process.exit(0))
  .catch(error => process.exit(1))