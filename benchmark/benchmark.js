var USON = require('../');
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

suite.add('Basic quoted', function() {
  USON.parse('"hello"');
})

suite.add('Basic', function() {
  USON.parse('a');
})

suite.add('Nested', function() {
  USON.parse('a:b:c:d:e:f');
})

.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})

.run({ async: true });
