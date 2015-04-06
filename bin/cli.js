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

if(program.args.length < 1) {
  // TODO stdin & stdout
  program.outputHelp();
  process.exit(1);
};

var input = program.args.join(' ');
var options = { mode: program.object ? 'object' : null};
var output = USON.parse(input, options);
var str = null;

if(program.yaml) {
  str = yaml.dump(output);
} else {
  str = JSON.stringify(output, null, (program.pretty ? 2 : false));
}
process.stdout.write(str);


