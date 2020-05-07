clipman
===

Helper to write and run nodejs apps from the terminal.

## Install

```bash
npm install --global clipman
```

## Quick start

```bash
clipman init hello-world
```

This creates a new clipman app

You can now run your new clipman app

```bash
clipman run hello-world
```

```
Hello world!
```

You can also see the help section:

```bash
clipman help hello-world
```

```
hello-world v1.0.0  | Issue greetings

* Usage

hello-world <options>

* Options

--name       string     Who to greet (optional, default: "world")

made with clipman
```

Let's try to pass it an option

```bash
clipman run hello-world --name javascript
```

```
Hello javascript!
```

Let's change our `hello-world/clipman.json`:

```json
{
  "name": "hello-world",
  "version": "1.0.0",
  "description": "Issue greetings",
  "entry": "main.js",
  "options": {
    "name": {
      "description": "Who to greet",
      "default": {
        "value": "world"
      }
    }
  }
}
```

Change `world` by `node`, save the file and then:

```bash
clipman run hello-world
```

```
Hello node!
```

## Docs

- [Build for npm](here.md)
- [Commands](here.md)
- [Config](here.md)
- [JS API](./docs/js-api.md)
- [Options](./docs/options.md)
