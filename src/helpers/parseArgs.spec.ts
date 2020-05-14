import parseArgs, { parseType, mergeDefaultValues } from './parseArgs'
import * as os from 'os'
import { ClipmanOptionSchema, ClipmanInputOptions } from '../types'

describe('Type parsing', () => {
  function expectToParseType(
    schema: ClipmanOptionSchema,
    options: ClipmanInputOptions,
    expected: ClipmanInputOptions
  ) {
    const parsed = parseType(schema, options)
    expect(parsed).toEqual(expected)
  }
  
  it('should default to string', () => {
    expectToParseType({ foo: {} }, { foo: 1 }, { foo: '1' })
  })

  it('should apply string', () => {
    expectToParseType({ foo: { type: 'string' } }, { foo: 1 }, { foo: '1' })
  })

  it('should apply number', () => {
    expectToParseType({ foo: { type: 'number' } }, { foo: '1' }, { foo: 1 })
  })

  it('should apply boolean', () => {
    expectToParseType({ foo: { type: 'boolean' } }, { foo: 'false' }, { foo: false })
  })

  it('should apply objects', () => {
    expectToParseType({
      'foo.bar': { type: 'string' }
    }, {
      foo: { bar: 22 }
    }, {
      foo: { bar: '22' }
    })
  })
})

describe('Defaults', () => {
  async function expectDefault(
    schema: ClipmanOptionSchema,
    options: ClipmanInputOptions,
    expected: ClipmanInputOptions
  ) {
    const parsed = await mergeDefaultValues(schema, options)
    expect(parsed).toEqual(expected)
  }
  
  it('should apply default', async () => {
    const schema = { foo: { default: { value: 'bar' } } }
    const options = {}
    const expected = { foo: 'bar' }
    await expectDefault(schema, options, expected)
  })
  it('should apply default with type cast', async () => {
    const schema = { foo: { type: 'string', default: { value: 1 } } }
    const options = {}
    const expected = { foo: '1' }
    await expectDefault(schema, options, expected)
  })
  it('should apply default with command', async () => {
    const schema = { foo: { default: { command: 'echo bar' } } }
    const options = {}
    const expected = { foo: 'bar' }
    await expectDefault(schema, options, expected)
  })
  it('should apply default with command and type cast', async () => {
    const schema = { foo: { type: 'number', default: { command: 'echo 1' } } }
    const options = {}
    const expected = { foo: 1 }
    await expectDefault(schema, options, expected)
  })
  it('should skip default', async () => {
    const schema = { foo: { default: { value: 'bar' } } }
    const options = { foo: 'lambda' }
    const expected = { foo: 'lambda' }
    await expectDefault(schema, options, expected)
  })
  it('should apply templates', async () => {
    const schema = {
      foo: {
        default: {
          value: '{{ options.bar }}',
          useTemplate: true
        }
      }
    }
    const options = { bar: 'lol' }
    const expected = { foo: 'lol', bar: 'lol' }
    await expectDefault(schema, options, expected)
  })
})

describe('Parse args', () => {
  async function tester(
    schema: ClipmanOptionSchema,
    options: ClipmanInputOptions,
    expected: any
  ) {
    const res = await parseArgs(schema, options)
    expect(res).toEqual(expected)
  }

  it('should return empty if no schema', async () => {
    const schema = {}
    const options = { foo: '1' }
    const expected = {}
    await tester(schema, options, expected) 
  })

  it('should return options if schema', async () => {
    const schema = { foo: {} }
    const options = { foo: '1' }
    const expected = { foo: '1' }
    await tester(schema, options, expected) 
  })

  it('should apply types', async () => {
    const schema = { foo: { type: 'number' } }
    const options = { foo: '1' }
    const expected = { foo: 1 }
    await tester(schema, options, expected) 
  })

  it('should apply defaults', async () => {
    const schema = { foo: { default: { value: '1' } } }
    const options = {}
    const expected = { foo: '1' }
    await tester(schema, options, expected) 
  })
})