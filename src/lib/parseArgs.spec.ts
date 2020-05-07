import parseArgs from './parseArgs'

test('it should fail required=true', async () => {
  const config = {
    foo: {
      required: true
    }
  }
  const options = {}
  return expect(parseArgs(config, options))
    .rejects
    .toHaveProperty('message', 'Missing required option: foo')
})

test('it should pass required=true', async () => {
  const config = {
    foo: {
      required: true
    }
  }
  const options = {
    foo: true
  }
  expect(await parseArgs(config, options)).toEqual({ foo: true })
})

test('it should apply required if options.bar is above 2', async () => {
  const config = {
    foo: {
      required: {
        if: 'options.bar > 2'
      }
    },
    bar: {
      type: 'number'
    }
  }
  const options = {
    bar: 3
  }
  return expect(parseArgs(config, options))
    .rejects
    .toHaveProperty('message', 'Missing required option: foo')
})

test('it should fail if options.bar is below 2', async () => {
  const config = {
    foo: {
      required: {
        if: 'options.bar > 2'
      }
    },
    bar: {
      type: 'number'
    }
  }
  const options = {
    bar: 1
  }
  return expect(await parseArgs(config, options)).toEqual({ bar: 1 })
})
