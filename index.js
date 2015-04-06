var parser = require('./dist/parser');
var toString = Object.prototype.toString;

function nestObject(key, value) {
  output = {};
  return output;
}

function TreeInterpreter() {
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

TreeInterpreter.prototype.visit = function(node) {
  var self = this;
  if(toString.call(node) === "[object Array]") {
    if(node[0] == 'objectAdd') {
      var output = {};
      output[node[1][0].join('.')] = node[2]; 
      return self.visitObject(output);
    } else if(node[0] == 'arrayAdd') {
      return self.visit(node[1]);
    } else {
      var output = [];
      node.forEach(function(n){
        output.push(self.visit(n));
      });
      return output;
    }
  } else if (toString.call(node) === "[object]") {
    return self.visitObject(node);
  } else {
    return node;
  }
}

module.exports = {
  parse: function(str) {
    var interpreter = new TreeInterpreter;
    var tree = parser.parse(str);
    return interpreter.visit(tree);
  },
  stringify: function() {}
}
