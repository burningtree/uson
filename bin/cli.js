#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var uson = require('../');
var program = require('commander');
var pInfo = require('../package.json');

var RCFILE = '.usonrc.js';

program
  .version(pInfo.version)
  .description(pInfo.description)
  .usage('[options] [expression]')
  .option('-o, --object', '"object" mode')
  .option('-j, --json', '"json" mode')
  .option('-i, --input <file>', 'Load data from file')
  .option('    --output <file>', 'Write output to file')
  .option('-f, --form', 'Return output in form query-string (optional)')
  .option('-y, --yaml', 'Return output in YAML (optional)')
  .option('-m, --msgpack', 'Return output in msgpack (optional)')
  .option('-p, --pretty', 'Pretty print output (only JSON output)')
  .option('-u, --usonrc <usonrc>', 'Use <usonrc> instead of any .usonrc.js')
  .option('    --hex', 'Output in hex encoding')
  .option('    --base64', 'Output in base64 encoding');

function Runtime(program) {
  this.program = program;
  this.availablePlugins = {
    yaml: 'js-yaml',
    msgpack: 'msgpack',
    form: 'qs'
  };
  this.plugins = this.loadPlugins() || {};
  this.rc = this.loadRc() || {};
}

Runtime.prototype.error = function(str) {
  console.log('Error: %s', str);
  process.exit(1);
};

Runtime.prototype.loadPlugins = function() {
  var rt = this;
  var plugins = {};
  var config = this.availablePlugins;
  Object.keys(config).forEach(function(k) {
    if(rt.program[k]) {
      try { plugins[k] = require(config[k]); }
      catch (e) {
        rt.error('Cannot load package: '+config[k]+' ('+k+' mode)\n'+
              'Installation instruction: npm install -g '+config[k]);
      }
    }
  });
  return plugins;
};

Runtime.prototype.loadRc = function() {
  var fn = null;
  var home = process.env[
    (process.platform === 'win32') ? 'USERPROFILE' : 'HOME'
  ];
  if(this.program.usonrc) {
    fn = path.resolve(this.program.usonrc);
    if(fs.existsSync(fn)) {
      return require(fn);
    }
    return this.error('rc file not exists: '+this.program.usonrc);
  }
  fn = path.resolve(home, RCFILE);
  if(fs.existsSync(fn)) {
    return require(fn);
  }
};

Runtime.prototype.parse = function(input) {
  var mode = (this.program.object ?
    'object' : (this.program.json ? 'json' : false));

  var output = uson.parse(input, mode, this.rc.types);
  var space = (this.program.pretty ? 2 : false);

  if(this.program.msgpack) {
    return this.plugins.msgpack.pack(output);
  }
  if(this.program.yaml) {
    return this.plugins.yaml.dump(output);
  }
  if(this.program.form) {
    return this.plugins.form.stringify(output);
  }
  return JSON.stringify(output, null, space)+'\n';
};


Runtime.prototype.listenStdin = function() {
  var rt = this;
  process.stdin.on('data', function (buf) {
    var str = buf.toString().trim();
    if(!str) { return; }
    rt.process(str);
  });
  process.stdin.on('end', function () {
    process.exit();
  });
};

Runtime.prototype.writeData = function(data) {
  if(this.program.output) {
    if(fs.existsSync(this.program.output)) {
      return this.error('File exists: '+this.program.output+', exiting ..');
    }
    fs.writeFileSync(this.program.output, data);
    console.log('File saved: '+this.program.output);
    return;
  }
  if(this.program.hex) {
    data = new Buffer(data).toString('hex')+'\n';
  } else if(this.program.base64) {
    data = new Buffer(data).toString('base64')+'\n';
  }
  process.stdout.write(data);
};

Runtime.prototype.process = function(data) {
  this.writeData(this.parse(data));
};

(function runProgram(program) {

  var runtime = new Runtime(program);

  if(program.input) {
    if(!fs.existsSync(program.input)) {
      runtime.error('File not exists: ' + program.input);
    }
    var data = fs.readFileSync(program.input).toString();
    runtime.process(data);
  }

  else if(program.args.length < 1) {
    runtime.listenStdin();
  } else {
    runtime.process(program.args.join(' '));
  }
})(program.parse(process.argv));

