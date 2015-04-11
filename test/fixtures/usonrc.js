module.exports = {
  types: {
    // `js!<expression>` , for example: `js!"4+5"`
    js: function(js) {
      return eval(js);
    },
    // `hello!<name>`
    'hello': function(val) {
      return 'Hello '+ val;
    }
  }
}
