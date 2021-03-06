import { promisify } from "util"
import { exec } from "child_process"
import shortid from "shortid"
import { YOUR_APP_IS_READY } from "../messages"

const target = `/tmp/clipman-test-${ shortid.generate() }`

test('it should init a new repo', async () => {
  const { stdout } = await promisify(exec)(`node ./dist/clipman init ${ target }`)
  expect(stdout.replace(/\n$/, '')).toEqual(YOUR_APP_IS_READY(target))
})

test('it should run new app with direct link to clipman.json', async () => {
  const { stdout } = await promisify(exec)(`node ./dist/clipman run ${ target }/clipman.json`)
  expect(stdout.replace(/\n$/, '')).toEqual('Hello, world!')
})

test('it should run new app with link to its directory', async () => {
  const { stdout } = await promisify(exec)(`node ./dist/clipman run ${ target }`)
  expect(stdout.replace(/\n$/, '')).toEqual('Hello, world!')
})
