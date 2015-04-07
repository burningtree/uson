start = ws head:control tail:expr {return [head].concat(tail)}

expr = ws out:(v:control ws {return v})* ws {return out}

control
  = k:keyExpr tail:(ws ':' ws v:control {return v}) {return {type:'ObjectAssign',value:[k].concat(tail)}}
  / value
  / comment

keyExpr = k:key tail:('[' k:key? ']' {return k || true})* {return [[k]].concat(tail)}

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

comment = '#' [^\r\n]+ {return {$$destroy:true}}

object = '{' v:expr '}' {return {type:'ObjectAdd',value:v}}

array = '[' v:expr ']' {return {type:'ArrayAdd',value:v}}

boolean = v:('true' / 'false') {return v=='true'}

undefined = 'undefined' {return undefined}

null = 'null' {return null}

regExp = '/' pattern:[^/]* '/' flags:[i]* {return new RegExp(pattern.join(''), flags)}

number = v:[0-9\.\-]+ {return parseFloat(v.join(''))}

quotedString = '"' s:[^"]+ '"' {return s.join('')}

string = v:[-_a-zA-Z0-9]+ {return v.join('')}

ws = [\r\t\n, ]*
