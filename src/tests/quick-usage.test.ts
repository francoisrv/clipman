import { promisify } from "util"
import { exec } from "child_process"
import shortid from "shortid"
import { YOUR_APP_IS_READY } from "../messages"
import help from "../lib/help"
import { join } from "path"
import { readFile, writeFile } from "fs"

const target = `/tmp/clipman-test-${ shortid.generate() }`
const json = join(target, 'clipman.json')

const getJson = async () => {
  const content = await promisify(readFile)(json)
  return JSON.parse(content.toString())
}

test('it should init a new repo', async () => {
  const { stdout } = await promisify(exec)(`node ./dist/clipman init ${ target }`)
  expect(stdout.replace(/\n$/, '')).toEqual(YOUR_APP_IS_READY(target))
})

test('it should run new app', async () => {
  const { stdout } = await promisify(exec)(`node ./dist/clipman run ${ target }`)
  expect(stdout.replace(/\n$/, '')).toEqual('Hello, world!')
})

test('it should display help', async () => {
  const { stdout } = await promisify(exec)(`node ./dist/clipman help ${ target }`)
  expect(stdout.replace(/\n$/, '')).toEqual(await help(await getJson()))
})

test('it should run new app with option', async () => {
  const { stdout } = await promisify(exec)(`node ./dist/clipman run ${ target } --name javascript`)
  expect(stdout.replace(/\n$/, '')).toEqual('Hello, javascript!')
})

test('it should accept changes', async () => {
  const content = await getJson()
  content.options.name.default.value = 'node'
  await promisify(writeFile)(json, JSON.stringify(content, null, 2))
  const { stdout } = await promisify(exec)(`node ./dist/clipman run ${ target }`)
  expect(stdout.replace(/\n$/, '')).toEqual('Hello, node!')
})