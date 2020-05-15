clipman configuration file
===

The `clipman` configuration file contains all the information to run your app. The file has to be saved as `clipman.json`

## Example

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

## name

The name of your clipman app

## version

The version of your clipman app

##  description

The description of your clipman app

## entry

This is the node file that will be run using node, so `"entry": "main.js"` will be run under the hoode as `node main.js <input> <option> <target>`