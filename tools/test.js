var USON = require('..');
console.log(JSON.stringify(USON.parse('null')));
console.log(JSON.stringify(USON.parse('')));
console.log(JSON.stringify(USON.parse('  ')));
console.log(JSON.stringify(USON.parse('  # neco')));
console.log(JSON.stringify(USON.parse('# neco')));
