var chance = require('chance')();

module.exports = {
  types: {
    // `g!<method>` , for example: `g!name`
    g: function(val) {
      var args = [];
      var cmd = null;
      if(typeof val == "object") {
        cmd = Object.keys(val)[0];
        args = val[cmd];
      } else {
        cmd = val;
      }
      return chance[cmd] ? chance[cmd](args) : null;
    },
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
