start = ws head:control tail:expr {return {type:'expr',value:head,tail:tail}}

expr = ws out:(v:control ws {return v})* ws {return out}

control
  = k:keyExpr tail:(ws ':' ws v:control {return v}) {return {type:'objectAdd',value:[k].concat(tail)}}
  / value

keyExpr = k:nestedKey tail:('[' k:nestedKey? ']' {return k || true})* {return {type:'keyExpr',value:[k].concat(tail)}}

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

object = '{' v:expr '}' {return {type:'objectAddNormal',value:v}}

array = '[' v:expr ']' {return {type:'arrayAdd',value:v}} 

boolean = v:('true' / 'false') {return v=='true'}

undefined = 'undefined' {return undefined}

null = 'null' {return null}

regExp = '/' pattern:[^/]* '/' flags:[i]* {return new RegExp(pattern.join(''), flags)}

number = v:[0-9\.\-]+ {return parseFloat(v.join(''))}

quotedString = '"' s:[^"]+ '"' {return s.join('')}

string = v:[-_a-zA-Z0-9]+ {return v.join('')}

ws = [\r\t\n, ]*
