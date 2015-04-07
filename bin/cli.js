#!/usr/bin/env node

var USON = require('../');
var program = require('commander');
var yaml = require('js-yaml');
var version = require('../package.json').version;

program
  .version(version)
  .usage('[options] <input>')
  .option('-p, --pretty', 'Pretty print output (only JSON)')
  .option('-y, --yaml', 'Use YAML dialect instead of JSON')
  .option('-o, --object', 'Object mode')
  .parse(process.argv);

function parse(input) {
  var output = USON.parse(input, program.object);
  var space = (program.pretty ? 2 : false);
  var str = null;

  if(program.yaml) {
    str = yaml.dump(output);
  } else {
    str = JSON.stringify(output, null, space);
  }
  return str;
}

if(program.args.length < 1) {
  process.stdin.on('data', function (buf) {
    var str = buf.toString().trim();
    if(!str) { return; }
    process.stdout.write(parse(str));
  });
  process.stdin.on('end', function () {
    process.exit();
  });

} else {
  process.stdout.write(parse(program.args.join(' ')));
}

