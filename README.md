# μson
μson (uson) is a compact and human-readable data serialization format especially designed for shell.

Inspiration by python CLI utility [jarg](https://github.com/jdp/jarg) by Justin Poliey (@jdp).

## Examples
```
endpoint.id:wikipedia pages:[Malta Prague "New York"]
```

Result in JSON:
```json
[
  {
    "endpoint": {
      "id": "wikipedia"
    }
  },
  {
    "pages": [
      "Malta",
      "Prague",
      "New York"
    ]
  }
]
```

or in YAML:
```yaml
- endpoint:
    id: wikipedia
- pages:
    - Malta
    - Prague
    - New York
```

## CLI

You can install node.js CLI utility via npm:
```
$ npm install -g uson
```

### Usage
Usage is simple:

```
$ uson 'user:john age:42'
```

For YAML use -y, --yaml option:
```
$ uson -y 'endpoint.id:wikipedia pages:[Malta Prague "New York"]'
```

Complete usage:
```
$ uson --h

  Usage: uson [options] <input>

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -p, --pretty   Pretty print output (only JSON)
    -y, --yaml     Use YAML dialect instead of JSON
```

## Grammar
See [uson.pegjs](uson.pegjs) file.

## Author
Jan Stránský &lt;jan.stransky@arnal.cz&gt;

## Licence
MIT

