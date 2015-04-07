#!/usr/bin/env node
'use strict';

var fs = require('fs');
var USON = require('../');
var yaml = require('js-yaml');
var msgpack = require('msgpack');
var program = require('commander');
var pversion = require('../package.json').version;

program
  .version(pversion)
  .usage('[options] [expression]')
  .option('-i, --input <file>', 'Load data from file')
  .option('    --output <file>', 'Write output to file')
  .option('-p, --pretty', 'Pretty print output (only JSON)')
  .option('-y, --yaml', 'Return output in YAML')
  .option('-m, --msgpack', 'Return output in msgpack')
  .option('-o, --object', 'Object mode')
  .parse(process.argv);

function parse(input) {
  var output = USON.parse(input, program.object);
  var space = (program.pretty ? 2 : false);
  var str = null;

  if(program.msgpack) {
    return msgpack.pack(output);
  }
  if(program.yaml) {
    return yaml.dump(output);
  }
  return JSON.stringify(output, null, space);
}

function writeData(data) {
  if(program.output) {
    if(fs.existsSync(program.output)) {
      console.log('File exists: '+program.output+', exiting ..');
      process.exit(1);
    }
    fs.writeFileSync(program.output, data);
    console.log('File saved: '+program.output);
    return;
  }
  process.stdout.write(data + '\n');
}

function listenStdin() {
  process.stdin.on('data', function (buf) {
    var str = buf.toString().trim();
    if(!str) { return; }
    writeData(parse(str));
  });
  process.stdin.on('end', function () {
    process.exit();
  });
}

function runProgram(program) {
  if(program.input) {
    if(!fs.existsSync(program.input)) {
      throw new Error('File not exists: ' + program.input);
    }
    var data = fs.readFileSync(program.input).toString();
    writeData(parse(data));
  }

  else if(program.args.length < 1) {
    listenStdin();
  } else {
    writeData(parse(program.args.join(' ')));
  }
}

runProgram(program);

