import ensureRequired from "./ensureRequired"

function expectToPass(config: any, input: any) {
  expect(ensureRequired(config, input))
}

function expectToFail(config: any, input: any, errorMessage: string) {
  expect(() => ensureRequired(config, input))
    .toThrowError(errorMessage)
}

test('it should fail if a required option is missing', () => {
  expectToFail(
    { foo: { required: true } },
    {},
    'Missing required option: foo'
  )
})

test('it should pass if required option is present', () => {
  expectToPass(
    { foo: { required: true, type: 'boolean' } },
    { foo: true },
  )
})

test('it should fail if a conditional required option is missing', () => expectToFail(
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

test('it should pass if a conditional required is met', () => {
  expectToPass(
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
  )
})