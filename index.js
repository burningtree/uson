var _ = require('lodash');
var parser = require('./dist/parser');
var toString = Object.prototype.toString;

function nestObject(key, value) {
  output = {};
  return output;
}

function TreeInterpreter(options) {
  var options = options || {};
  this.expandQueue = [];
  this.mode = options.mode || 'array';
}

TreeInterpreter.prototype.process = function(node) {
  if(this.mode == 'object') {
    var output = this.visit(node);
    return this.visitobjectAddNormal({}, output);
  }
  return this.visit(node);
}

TreeInterpreter.prototype.visitObject = function(node) {
  var self = this;
  Object.keys(node).forEach(function(k){
    if(m = k.match(/^([^\.]+)\.(.+)$/)) {
      var obj = {};
      obj[m[2]] = node[k];
      node[m[1]] = self.visitObject(obj);
      delete node[k];
    }
  });
  return node;
}

TreeInterpreter.prototype.visitArray = function(node) {
  var output = [];
  var self = this;
  node.forEach(function(item) {
    output.push(self.visit(item));
  });
  return output;
}

TreeInterpreter.prototype.visitobjectAdd = function(node) {
  var out = {};
  var key = this.visit(node.value[0]);
  out[key[0].join('.')] = this.visit(node.value[1]);
  return this.visitObject(out);
}

TreeInterpreter.prototype.visitobjectAddNormal = function(node, values) {
  var values = values || this.visitArray(node.value);
  var arrcount = 0;
  var obj = {};
  values.forEach(function(item) {
    var type = toString.call(item);
    if(type == '[object Array]') {
      obj[arrcount] = item;
      arrcount = arrcount+1;
    } else if(type == '[object Object]') {
      obj = _.assign(obj, item);
    } else {
      obj[arrcount] = item;
      arrcount = arrcount+1;
    }
  });
  return obj;
}


TreeInterpreter.prototype.visitkeyExpr = function(node) {
  return this.visit(node.value);
}

TreeInterpreter.prototype.visitarrayAdd = function(node) {
  return this.visit(node.value);
}

TreeInterpreter.prototype.visitexpr = function(node) {
  var array = [this.visit(node.value)].concat(this.visit(node.tail));
  return array;
}

TreeInterpreter.prototype.visit = function(node) {

  var type = toString.call(node);
  if(type == '[object Array]') {
    return this.visitArray(node);
  } else if (type == '[object Object]') {
    if(!node.type) return node;
    var visitMethod = this["visit"+node.type];
    if(visitMethod === undefined) {
      throw new Error('No visit method: '+node.type);
    }
    var out = visitMethod.call(this, node);
    return out;
  } else {
    return node;
  }
}

module.exports = {
  parse: function(str, options) {
    var interpreter = new TreeInterpreter(options);
    var tree = parser.parse(str);
    return interpreter.process(tree);
  },
  stringify: function() {}
}
