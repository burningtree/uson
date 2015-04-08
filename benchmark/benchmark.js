var USON = require('../');
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var msgpack = require('msgpack');

var jsonFile = fs.readFileSync(path.resolve(__dirname, '../test/fixtures/json-pass1.json')).toString();
var packageJson = fs.readFileSync(path.resolve(__dirname, '../package.json')).toString();
var packageObject = JSON.parse(packageJson);
var packageYaml = yaml.dump(packageObject);
var packagePack = msgpack.pack(packageObject);

suite.add('Parsing package.json (default JSON.stringify()', function() {
  JSON.parse(packageJson);
});

suite.add('Parsing package.json (YAML)', function() {
  yaml.load(packageYaml);
});

suite.add('Parsing package.json (msgpack)', function() {
  msgpack.unpack(packagePack);
});

suite.add('Parsing package.json (uson)', function() {
  USON.parse(packageJson);
});

suite.add('JSON benchmark', function() {
  USON.parse(jsonFile);
});

suite.add('Parser only', function() {
  USON.parser.parse('"hello"');
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
