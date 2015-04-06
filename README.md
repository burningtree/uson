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

## Grammar
See (uson.pegjs)[uson.pegjs] file.

## Author
Jan Stránský &lt;jan.stransky@arnal.cz&gt;

## Licence
MIT

