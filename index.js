'use strict';

var parser = require('./dist/parser');
var assign = require('object-assign');
var toString = Object.prototype.toString;

var usonTypes = {
  // collection
  'obj': function(val) { return val; },
  'arr': function(val) { return val; },

  // scalars
  'str': function(val) { return val.toString(); },
  'int': function(val) { return parseInt(val); },
  'float': function(val) { return parseFloat(val); },
  'null': function() { return null; },
  'date': function(val) { return new Date(val); },
  'bool': function(val) { return val ? true : false; },
};

var usonOperations = {
  'obj': {
    '+': function(val, expr) { return 'x' }
  },
  'float': {
    '*': function(v, expr) { return v.value * expr.value },
    '+': function(v, expr) { return v.value + expr.value }
  },
  'str': {
    '*': function(v, expr) {
      var count = expr.value;
      while(count < 1) return '';
      var result = '';
      while(count > 1) {
        if(count & 1) result += v.value;
        count >>= 1, v.value += v.value;
      }
      return { 'type': 'str', value: result + v.value };
    },
    '+': function(v, expr) { return v.value + expr.value; }
  }
};

function Interpreter(options) {
  options = options || {};
  this.mode = options.mode || false;
  this.types = options.types || {};
}

Interpreter.prototype.process = function(arr) {

  var data = this.toJSON(arr);
  switch(this.mode) {
    case 'object':
      return this.toObject(data);
    case 'json':
      return data[0];
    // default `array` mode
    default:
      return data;
  }
};

Interpreter.prototype.toJSON = function(arr) {
  var intrp = this;
  if(toString.call(arr) == '[object Array]') {
    var output = [];
    arr.forEach(function(it) {
      output.push(intrp.toJSON(it));
    });
    return output;
  }
  else if(toString.call(arr) == '[object Object]') {
    console.log(arr);
    if(arr.type) {
      if(arr.type == 'obj')
      {
        var out = {};
        Object.keys(arr.value).forEach(function(k) {
          out[k] = intrp.toJSON(arr.value[k]);
        });
        return out;
      } else if(this.types[arr.type]){
        return this.toJSON(this.types[arr.type](arr.value));
      }
    }
  }
  return arr;
}

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

var uson = {
  parse: function(str, mode, types) {
    // convert to string
    if(toString.call(str) === '[object Object]' && str.toString) {
      str = str.toString();
    }
    // assign types
    types = assign(usonTypes, types || {});
    // parse
    var arr = parser.parse(str, { type: types, operation: usonOperations });
    // create interpreter
    var interpreter = new Interpreter({ mode: mode || false, types: types });
    // process
    return interpreter.process(arr);
  },
  stringify: function() { return null; },
  parser: parser
};

module.exports = uson;
