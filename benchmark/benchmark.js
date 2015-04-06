var USON = require('../');
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

suite.add('Parser only', function() {
  USON.tokenize('"hello"');
});

suite.add('Basic quoted', function() {
  USON.parse('"hello"');
});

suite.add('Basic', function() {
  USON.parse('a');
});

suite.add('Nested', function() {
  USON.parse('a:b:c:d:e:f');
});

suite.on('cycle', function(event) {
    console.log(String(event.target));
});

suite.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});

suite.run({ async: true });
