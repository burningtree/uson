'use strict';

var parser = require('./dist/parser');
var assign = require('object-assign');
var toString = Object.prototype.toString;

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
      arrcount = arrcount+1;
    }
  });
  return obj;
};

var USON = {
  parse: function(str, mode) {
    // convert to string
    if(toString.call(str) === '[object Object]' && str.toString) {
      str = str.toString();
    }
    // parse
    var arr = parser.parse(str);
    // create interpreter
    var interpreter = new Interpreter({ mode: mode || false });
    // process
    return interpreter.process(arr);
  },
  stringify: function() { return null; },
  parser: parser
};

module.exports = USON;
