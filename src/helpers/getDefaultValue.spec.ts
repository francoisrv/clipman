import { ClipmanDefaultOption } from "../types"
import { getDefaultValue } from "./getDefaultValue"

async function tester(schema: ClipmanDefaultOption, vars: object, expected: any) {
  const result = await getDefaultValue(schema, vars)
  expect(result).toEqual(expected)
}

test('it should apply command', async () => {
  const schema: ClipmanDefaultOption = {
    command: 'echo bar'
  }
  const vars = {}
  const expected = 'bar'
  await tester(schema, vars, expected)
})

test('it should apply command with templates', async () => {
  const schema: ClipmanDefaultOption = {
    command: 'echo {{ bar }}',
    useTemplate: true
  }
  const vars = { bar: 'bar' }
  const expected = 'bar'
  await tester(schema, vars, expected)
})

test('it should apply value', async () => {
  const schema: ClipmanDefaultOption = {
    value: 'bar'
  }
  const vars = {}
  const expected = 'bar'
  await tester(schema, vars, expected)
})

test('it should apply value with templates', async () => {
  const schema: ClipmanDefaultOption = {
    value: '{{ bar }}',
    useTemplate: true
  }
  const vars = { bar: 'bar' }
  const expected = 'bar'
  await tester(schema, vars, expected)
})