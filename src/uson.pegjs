/*
 * μson Grammar
 * ============
 *
 * Version: draft-0
 * Date: 2015-04-09
 *
 * Based on the JSON grammar from RFC 7159 [1].
 *
 * The original JSON PEG.js grammar was written by
 *   David Majda (@dmajda)
 *
 * (c) 2015 Jan Stránský <https://keybase.io/tree>
 * μson may be freely distributed or modified under the MIT license.
 *
 * [1] http://tools.ietf.org/html/rfc7159
 *
 */

/* ----- μson Grammar ----- */

uson_text
  = head:expr? ws tail:expr*
    {
      if(head==null && text()!=="null"){ return [] };
      return [head].concat(tail);
    }

expr
  = ws v:value ws op:operator? ws
  {
    if(v && v.type) {
      if(op && options.operation[v.type] &&
          options.operation[v.type][op.op]) {
        return options.operation[v.type][op.op](v, op.expr);
      }
    }
    return v;
    //if(val && val.type) {
    //  val = options.type[val.type](val.value);
    //}
    //return val;
  }

statement = ws v:value ws op:operator? ws
  {
    return { stat: v, op: op };
  }

begin_array     = ws "[" ws
begin_object    = ws "{" ws
begin_group     = ws "(" ws
end_array       = ws "]" ws
end_object      = ws "}" ws
end_group       = ws ")" ws
name_separator  = ws ":" ws
value_separator = ws [ ,]* ws
comment_start   = "#"
typed_start     = ws "!" ws
ws_char         = [ \t\n\r]

ws "whitespace" = ws_char* comment?

/* ----- Groups ----- */

group  = begin_group v:expr end_group ws { return v }

/* ----- Operators ----- */

operator = op:[\*\+\-] v:expr { return {op:op, expr:v} }

/* ----- Values ----- */

value
  = group
  / typed
  / false
  / null
  / true
  / assign
  / object
  / array
  / number
  / string

null  = "null"  { return { type: "null", value: null }}
false = "false" { return { type: "bool", value: false }}
true  = "true"  { return { type: "bool", value: true }}

/* ----- Objects ----- */

object
  = begin_object
    members:(
      first:member
      rest:(value_separator m:member { return m; })*
      {
        var result = {}, i;
        result[first.name.value] = first.value;
        for (i = 0; i < rest.length; i++) {
          result[rest[i].name.value] = rest[i].value;
        }
        return result;
      }
    )?
    end_object
    { return { type: 'obj', value: members !== null ? members: {} }}


member
  = name:string name_separator value:expr {
      return { name: name, value: value };
    }

/* ----- Arrays ----- */

array
  = begin_array
    values:(
      first:expr
      rest:(value_separator? v:expr { return v; })*
      { return [first].concat(rest); }
    )?
    end_array
    { return { type: "arr", value: values !== null ? values : [] }}

/* ----- Numbers ----- */

number "number"
  = minus? int frac? exp? { return { type: "float", value: text() }; }

decimal_point = "."
digit1_9      = [1-9]
e             = [eE]
exp           = e (minus / plus)? DIGIT+
frac          = decimal_point DIGIT+
int           = zero / (digit1_9 DIGIT*)
minus         = "-"
plus          = "+"
zero          = "0"

/* ----- Strings ----- */

string "string"
  = s:(double_quoted_string
  / single_quoted_string
  / unquoted_string)
  { return { type: "str", value: s }; }

unquoted_string
  = v:simple_char+ { return v.join(""); }

single_quoted_string
  = "'" v:char_single_quoted* "'" { return v.join(""); }

double_quoted_string
  = '"' v:char_double_quoted* '"' { return v.join(""); }

simple_char        = unescaped_simple / escaped_char
char_single_quoted = unescaped_single_quote / escaped_char
char_double_quoted = unescaped_double_quote / escaped_char

escaped_char
  = escape
    sequence:(
        '"'
      / "'"
      / "\\"
      / "/"
      / "#"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
      / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
          return String.fromCharCode(parseInt(digits, 16));
        }
    )
    { return sequence; }

unescaped_simple
  = [\x21\x24-\x27\x2D-\x39\x3B-\x5A\x5E-\x7A\x7C\x7E-\u10FFFF]
     /*  forbidden chars: !"#()*,:[\]{}  */

unescaped_double_quote = [\x20-\x21\x23-\x5B\x5D-\u10FFFF]
unescaped_single_quote = [\x20-\x26\x28-\x5B\x5D-\u10FFFF]

escape                 = "\\"

/* ----- Assignations ----- */

assign
  = m:member
  { var obj={}; obj[m.name.value] = m.value;
    return { type: 'obj', value: obj }}

/* ----- Typed literals ----- */

typed
  = name:[a-zA-Z0-9_\-]+ typed_start value:expr
  { return { type:name.join(""), value: value }}

/* ----- Comments ----- */

comment = comment_start [^\n\r\u2028\u2029]*

/* ----- Core ABNF Rules ----- */

/* See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4627). */
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i

