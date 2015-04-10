var uson = require('./');
var yaml = require('js-yaml');
var assert = require('assert');

var str = '[ true, false, null, 1, 12.34, string, undefined, NaN, Number, "false" ]';
console.log(JSON.stringify(uson.parse(str, 'json')));
console.log(JSON.stringify(yaml.load(str)));

console.log(assert.deepEqual(uson.parse(str, 'json'), yaml.load(str)) ? false : true);

