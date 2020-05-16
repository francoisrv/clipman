import { promisify } from "util"
import { exec } from "child_process"
import shortid from "shortid"
import { YOUR_APP_IS_READY } from "../messages"
import { basename, join } from "path"

const target = `/tmp/clipman-test-${ shortid.generate() }`

test('it should init a new repo with an absolute path', async () => {
  const { stdout } = await promisify(exec)(`node ./dist/clipman init ${ target }`)
  expect(stdout.replace(/\n$/, '')).toEqual(YOUR_APP_IS_READY(target))
})

test('it should init a new repo with a relative path', async () => {
  const { stdout } = await promisify(exec)(`node ${ join(__dirname, '../clipman') } init ${ basename(target) }`, { cwd: '/tmp' })
  expect(stdout.replace(/\n$/, '')).toEqual(YOUR_APP_IS_READY(basename(target)))
})