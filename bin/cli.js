#!/usr/bin/env node
'use strict';

var fs = require('fs');
var USON = require('../');
var program = require('commander');
var pversion = require('../package.json').version;

program
  .version(pversion)
  .usage('[options] [expression]')
  .option('-o, --object', '"object" mode')
  .option('-j, --json', '"json" mode')
  .option('-i, --input <file>', 'Load data from file')
  .option('    --output <file>', 'Write output to file')
  .option('-p, --pretty', 'Pretty print output (only JSON)')
  .option('-y, --yaml', 'Return output in YAML (optional)')
  .option('-m, --msgpack', 'Return output in msgpack (optional)')
  .option('    --hex', 'Output in hex encoding')
  .option('    --base64', 'Output in base64 encoding')
  .parse(process.argv);

function error(str) {
  console.log('Error: %s', str);
  process.exit(1);
}

function loadPlugins(program) {
  var plugins = {};
  var config = { yaml: 'js-yaml', msgpack: 'msgpack' };
  Object.keys(config).forEach(function(k) {
    if(program[k]) {
      try { plugins[k] = require(config[k]); }
      catch (e) {
        error('Cannot load package: '+config[k]+' ('+k+' mode)\n'+
              'Installation instruction: npm install -g '+config[k]);
      }
    }
  });
  return plugins;
}

function parse(input, plugins) {
  var mode = (program.object ? 'object' : (program.json ? 'json' : false));
  var output = USON.parse(input, mode);
  var space = (program.pretty ? 2 : false);

  if(program.msgpack) {
    return plugins.msgpack.pack(output);
  }
  if(program.yaml) {
    return plugins.yaml.dump(output);
  }
  return JSON.stringify(output, null, space)+'\n';
}

function writeData(data) {
  if(program.output) {
    if(fs.existsSync(program.output)) {
      return error('File exists: '+program.output+', exiting ..');
    }
    fs.writeFileSync(program.output, data);
    console.log('File saved: '+program.output);
    return;
  }
  if(program.hex) {
    data = new Buffer(data).toString('hex')+'\n';
  } else if(program.base64) {
    data = new Buffer(data).toString('base64')+'\n';
  }
  process.stdout.write(data);
}

function listenStdin(plugins) {
  process.stdin.on('data', function (buf) {
    var str = buf.toString().trim();
    if(!str) { return; }
    writeData(parse(str, plugins));
  });
  process.stdin.on('end', function () {
    process.exit();
  });
}

function runProgram(program) {
  var plugins = loadPlugins(program);

  if(program.input) {
    if(!fs.existsSync(program.input)) {
      throw new Error('File not exists: ' + program.input);
    }
    var data = fs.readFileSync(program.input).toString();
    writeData(parse(data, plugins));
  }

  else if(program.args.length < 1) {
    listenStdin();
  } else {
    writeData(parse(program.args.join(' '), plugins));
  }
}

runProgram(program);

