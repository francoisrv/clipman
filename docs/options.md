clipman options
===

We use [clipop](https://www.npmjs.com/package/clipop) to parse arguments from command line

## About

`options` is a dictionnary of `Option` which typescript looks like this:

```ts
interface Option {
  description?: string
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


