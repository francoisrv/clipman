clipman options
===

We use [clipop](https://www.npmjs.com/package/clipop) to parse arguments from command line

## About

`options` is a dictionnary of `Option` which typescript looks like this:

```ts
interface Option {
  description?: string
  null?: true
  required?: boolean | { if: string }
  default?: { value: any } | { command: string }
  type?: 'boolean' | 'string' | 'number'
}
```

## description

A description about the option

```ts
{
  "options": {
    "foo": {
      "description": "Lorem lipsum"
    }
  }
}
```

## required

Either the options is required is not

```json
{
  "options": {
    "foo": {
      "required": true
    }
  }
}
```

You can also use templating via the `if` attribute. Let's say you have this clipman:

```json
{
  "options": {
    "http": {
      "description": "Use http"
    },
    "ssh": {
      "description": "Use ssh"
    }
  }
}
```

One of these two options should be required. We can use templating where `options` represent the input options:

```json
{
  "options": {
    "http": {
      "description": "Use http",
      "required": {
        "if": "!options.ssh"
      }
    },
    "ssh": {
      "description": "Use ssh",
      "required": {
        "if": "!options.http"
      }
    }
  }
}
```

## default

Default values for the option if it's missing. You can use `value` to specify a value:

```json
{
  "options": {
    "cores": {
      "description": "Number of cores",
      "type": "number",
      "default": {
        "value": 1
      }
    }
  }
}
```

You could also use a command to will be executed to determine what the default value should be

```json
{
  "options": {
    "cores": {
      "description": "Number of cores",
      "type": "number",
      "default": {
        "command": "nproc"
      }
    }
  }
}
```

You can also use [lodash templates](https://lodash.com/docs/4.17.15#template) in both `value` and `command` by adding `"useTemplate": true`

```json
{
  "options": {
    "performance": {
      "description": "Choose a performance mode",
      "type": ["low", "high"],
      "default": {
        "value": "high"
      }
    },
    "cores": {
      "description": "Number of cores",
      "type": "number",
      "default": {
        "command": "{{ options.performance === 'high' ? 'nproc' : 1 }}",
        "useTemplate": true
      }
    }
  }
}
```

## Types

They are 3 types you can get:

- string
- number
- boolean

If none is specified, string is used

It means value will be cast to the type declared

```json
{
  "options": {
    "foo": { "type": "number" },
    "bar": { "type": "number" }
  }
}
```

```bash
my-app --foo --bar 1
```

```json
{
  "foo": 1,
  "bar": 1
}
```

Objects have to be declared via their keys:

```json
{
  "options": {
    "foo.bar": { "type": "number" },
    "bar.foo.barz": { "type": "boolean" }
  }
}
```

```bash
my-app --foo.bar 1 --bar.foo.barz 1
```

```json
{
  "foo": {
    "bar": 1
  },
  "bar": {
    "foo": {
      "barz": true
    }
  }
}
```

Same goes with array

```json
{
  "options": {
    "foo[0]": { "type": "number" },
    "bar[0].foo": { "type": "boolean" }
  }
}
```

```bash
my-app --foo[0] 1 --bar[0].barz 1
```

```json
{
  "foo": [
    1
  ],
  "bar": [
    {
      "barz": true
    }
  ]
}
```
