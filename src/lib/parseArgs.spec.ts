import parseArgs from './parseArgs'

async function expectToPass(config: any, input: any, result: any) {
  expect(await parseArgs(config, input)).toEqual(result)
}

async function expectToFail(config: any, input: any, errorMessage: string) {
  return expect(parseArgs(config, input))
    .rejects
    .toHaveProperty('message', errorMessage)
}

test('it should fail if a required option is missing', async () => expectToFail(
  { foo: { required: true } },
  {},
  'Missing required option: foo'
))

test('it should pass if required option is present', async () => {
  await expectToPass(
    { foo: { required: true } },
    { foo: true },
    { foo: true }
  )
})

test('it should fail if a conditional required option is missing', async () => expectToFail(
  {
    foo: {
      required: {
        if: 'options.bar > 2'
      }
    },
    bar: {
      type: 'number'
    }
  },
  { bar: 3 },
  'Missing required option: foo'
))

test('it should pass if a conditional required is met', async () => {
  await expectToPass(
    {
      foo: {
        required: {
          if: 'options.bar > 2'
        }
      },
      bar: {}
    },
    { bar: 1 },
    { bar: 1 }
  )
})

test('it should apply default value', async () => {
  await expectToPass(
    { foo: { default: { value: 100 } } },
    {},
    { foo: 100 }
  )
})

test('it should execute command for default value', async () => {
  await expectToPass(
    { foo: { default: { command: 'pwd' } } },
    {},
    { foo: process.cwd() }
  )
})
