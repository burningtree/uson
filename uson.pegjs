start = ws head:control tail:(ws c:control {return c})* ws {return [head].concat(tail)}

control
  = k:keyExpr tail:(ws ':' ws v:value {return v}) {return ['objectAdd', k, tail]}
  / value

keyExpr = k:nestedKey tail:('[' k:nestedKey? ']' {return k || true})* {return [k, tail]}

nestedKey = head:key tail:('.' k:key {return k})* {return [head].concat(tail)}

key = k:[-_a-zA-Z0-9]+ {return k.join('')}

value
  = number
  / object
  / array
  / boolean
  / undefined
  / null
  / regExp
  / quotedString
  / string

object = '{' c:control '}' {return c}

array = '[' arr:(v:control [, ]* {return v})* ']' {return arr} 

boolean = v:('true' / 'false') {return v=='true'}

undefined = 'undefined' {return undefined}

null = 'null' {return null}

regExp = '/' pattern:[^/]* '/' flags:[i]* {return new RegExp(pattern.join(''), flags)}

number = v:[0-9.]+ {return parseFloat(v.join(''))}

quotedString = '"' s:[^"]+ '"' {return s.join('')}

string = v:[-_a-zA-Z0-9]+ {return v.join('')}

ws = [\r\t\n ]*
