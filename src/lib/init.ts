import { promisify } from "util"
import { mkdir, writeFile } from "fs"
import { compact } from "lodash"
import { basename, join, isAbsolute } from "path"
import { YOUR_APP_IS_READY } from "../messages"

async function createDirectory(dir: string) {
  try {
    await promisify(mkdir)(dir)
  } catch (error) {}
}

export default async function init(app: string) {
  if (!app) {
    throw new Error('Missing app')
  }
  const path = isAbsolute(app) ? app : join(process.cwd(), app)
  const bits = compact(path.split(/\//))
  const size = bits.length
  const dir = ['']
  for (let i = 0; i < size; i++) {
    dir.push(bits.shift() as string)
    await createDirectory(dir.join('/'))
  }
  const root = dir.join('/')
  const name = basename(root)
  await promisify(writeFile)(
    join(root, 'clipman.json'),
    JSON.stringify({
      "name": name,
      "version": "1.0.0",
      "description": "Issue greetings",
      "entry": "main.js",
      "options": {
        "name": {
          "description": "Who to greet",
          "default": {
            "value": "world"
          }
        }
      }
    }, null, 2)
  )
  await promisify(writeFile)(
    join(root, 'main.js'),
`module.exports = function (options) {
  return \`Hello, \$\{ options.name \}!\`
}
`
  )
  return YOUR_APP_IS_READY(app)
}