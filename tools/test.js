var USON = require('..');

var types = {
  welcome: function(value) {
    return("Hello " + value + "!");
  }
};
console.log(USON.parse('welcome!john', null, types));

console.log(JSON.stringify(USON.parse('null')));
console.log(JSON.stringify(USON.parse('')));
console.log(JSON.stringify(USON.parse('  ')));
console.log(JSON.stringify(USON.parse('  # neco')));
console.log(JSON.stringify(USON.parse('# neco')));
