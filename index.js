'use strict';

var parser = require('./dist/parser');
var assign = require('object-assign');
var toString = Object.prototype.toString;
var uson;

var usonTypes = {
  // collection
  'obj': function(val) { return JSON.parse('{' + val + '}'); },
  'arr': function(val) { return JSON.parse('[' + val + ']'); },

  // scalars
  'str': function(val) { return val.toString(); },
  'int': function(val) { return parseInt(val); },
  'float': function(val) { return parseFloat(val); },
  'null': function() { return null; },
  'date': function(val) { return new Date(val); },
  'bool': function(val) { return val === 'true' ? true : false; }
};

function Interpreter(options) {
  options = options || {};
  this.mode = options.mode || false;
}

Interpreter.prototype.process = function(arr) {
  switch(this.mode) {
  case 'object':
    return this.toObject(arr);
  case 'json':
    return arr[0];
  // default `array` mode
  default:
    return arr;
  }
};

Interpreter.prototype.toObject = function(values) {
  var arrcount = 0;
  var obj = {};
  values.forEach(function(item) {
    var type = toString.call(item);
    if(type === '[object Array]') {
      obj[arrcount] = item;
      arrcount = arrcount + 1;
    } else if(type === '[object Object]') {
      obj = assign(obj, item);
    } else {
      obj[arrcount] = item;
      arrcount = arrcount + 1;
    }
  });
  return obj;
};

uson = {
  'parse': function(str, mode, types) {
    var arr;
    var interpreter;

    // convert to string
    if(toString.call(str) === '[object Object]' && str.toString) {
      str = str.toString();
    }
    // assign types
    types = assign(usonTypes, types || {});
    // parse
    arr = parser.parse(str, { 'type': types });
    // create interpreter
    interpreter = new Interpreter({ 'mode': mode || false });
    // process
    return interpreter.process(arr);
  },
  'stringify': function() { return null; },
  'parser': parser
};

module.exports = uson;
