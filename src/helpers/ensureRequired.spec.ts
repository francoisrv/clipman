import ensureRequired from "./ensureRequired"

function expectToPass(config: any, input: any, result: any) {
  expect(ensureRequired(config, input)).toEqual(result)
}

function expectToFail(config: any, input: any, errorMessage: string) {
  return expect(ensureRequired(config, input))
    .rejects
    .toHaveProperty('message', errorMessage)
}

test('it should fail if a required option is missing', async () => {
  await expectToFail(
      { foo: { required: true } },
    {},
    'Missing required option: foo'
  )
})

test.only('it should pass if required option is present', async () => {
  await expectToPass(
    { foo: { required: true, type: 'boolean' } },
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
      bar: {
        type: 'number'
      }
    },
    { bar: 1 },
    { bar: 1 }
  )
})