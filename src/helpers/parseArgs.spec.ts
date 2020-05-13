import parseArgs, { parseType, parseDefault } from './parseArgs'
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
    const parsed = await parseDefault(schema, options)
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
  it('should skip default with templates', async () => {
    const schema = { foo: { default: { value: 'bar', useTemplate: true } } }
    const options = {}
    const expected = {}
    await expectDefault(schema, options, expected)
  })
})

// test.only('it should parse types', () => {
//   const schema = {
//     foo1: {},
//     foo2: { type: 'string' },
//     foo3: { type: 'number' },
//     foo4: { type: 'boolean' },
//     'foo5.bar': { type: 'number' }
//   }
//   const options = {
//     foo1: 1,
//     foo2: true,
//     foo3: '24',
//     foo4: 'false',
//     foo5: {
//       bar: '22'
//     }
//   }
//   const parsed = parseType(schema, options)
//   expect(parsed).toHaveProperty('foo1', '1')
//   // expect(parsed).toHaveProperty('foo2', 'true')
//   // expect(parsed).toHaveProperty('foo3', 24)
//   // expect(parsed).toHaveProperty('foo4', false)
//   // expect(parsed).toHaveProperty('foo5', { bar: 22 })
// })

// test('it should parse types (main)', async () => {
//   const schema = {
//     foo1: {},
//     foo2: { type: 'string' },
//     foo3: { type: 'number' },
//     foo4: { type: 'boolean' }
//   }
//   const options = {
//     foo1: 1,
//     foo2: true,
//     foo3: '24',
//     foo4: 'false'
//   }
//   await expectToPass(schema, options, {
//     foo1: '1',
//     foo2: 'true',
//     foo3: 24,
//     foo4: false
//   })
// })

// test('it should apply default value', async () => {
//   const opt = await parseArgs(
//     {
//       foo: {
//         default: {
//           value: 100
//         },
//         type: 'number'
//       }
//     },
//     {}
//   )
//   console.log(opt)
//   // await expectToPass(
//   //   { foo: { default: { value: 100 }, type: 'number' } },
//   //   {},
//   //   { foo: 100 }
//   // )
// })

// test('it should execute command for default value', async () => {
//   await expectToPass(
//     { foo: { default: { command: 'pwd' } } },
//     {},
//     { foo: process.cwd() }
//   )
// })

// test('it should apply templates for default value', async () => {
//   const options = {
//     performance: {
//       enum: ['low', 'high'],
//       default: { value: 'high' }
//     },
//     cores: {
//       type: 'number',
//       default: {
//         command: "{{ options.performance === 'high' ? 'nproc' : 'echo 1' }}",
//         useTemplate: true
//       }
//     }
//   }
//   const inputHigh = {}
//   await expectToPass(options, inputHigh, {
//     performance: 'high',
//     cores: os.cpus().length
//   })
// })
