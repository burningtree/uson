/*
 * μson Grammar
 * ============
 */

/* ----- μson Grammar ----- */

uson_text
  = head:expr? ws tail:expr*
    {
      if(head==null && text()!=="null"){ return [] };
      return [head].concat(tail);
    }

expr = ws v:value ws {return v}

begin_array     = ws "[" ws
begin_object    = ws "{" ws
end_array       = ws "]" ws
end_object      = ws "}" ws
name_separator  = ws ":" ws
value_separator = ws [ ,]* ws
comment_start   = "#"
ws_char         = [ \t\n\r]

ws "whitespace" = ws_char* comment?

/* ----- Values ----- */

value
  = false
  / null
  / true
  / assign
  / object
  / array
  / number
  / string

false = "false" { return false; }
null  = "null"  { return null;  }
true  = "true"  { return true;  }

/* ----- Objects ----- */

object
  = begin_object
    members:(
      first:member
      rest:(value_separator m:member { return m; })*
      {
        var result = {}, i;
        result[first.name] = first.value;
        for (i = 0; i < rest.length; i++) {
          result[rest[i].name] = rest[i].value;
        }
        return result;
      }
    )?
    end_object
    { return members !== null ? members: {}; }

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
    { return values !== null ? values : []; }

/* ----- Numbers ----- */

number "number"
  = minus? int frac? exp? { return parseFloat(text()); }

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
  = double_quoted_string
  / single_quoted_string
  / unquoted_string

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

escape                 = "\\"
unescaped_simple       = [\x21\x24-\x2B\x2D-\x39\x3B-\x5A\x5E-\x7A\x7C-\u10FFFF]
unescaped_double_quote = [\x20-\x21\x23-\x5B\x5D-\u10FFFF]
unescaped_single_quote = [\x20-\x26\x28-\x5B\x5D-\u10FFFF]

/* ----- Assignations ----- */

assign
  = m:member {var obj={}; obj[m.name] = m.value; return obj}

/* ----- Comments ----- */

comment = comment_start [^\n\r\u2028\u2029]*

/* ----- Core ABNF Rules ----- */

/* See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4627). */
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i

