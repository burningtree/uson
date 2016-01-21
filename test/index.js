'use strict';

var fs = require('fs');
var assert = require('assert');
var path = require('path');
var USON = require('../');

var loadFileSync = function(fn, cb) {
  return fs.readFileSync(fn, { 'encoding': 'utf8' });
}
var loadFixture = function(fn, cb) {
  fn = path.resolve(__dirname,'fixtures',fn);
  fs.readFile(fn, { 'encoding': 'utf8' }, function (err, data) {
    cb(JSON.parse(data));
  });
}

describe('test/index', function() {

  it('should parse JSON Test Pattern: pass #1', function(done) {
    var fn = path.resolve(__dirname,'fixtures','json-pass1.json');
    USON.parse(loadFileSync(fn));
    done();
  });

  it('should parse own package.json file', function(done) {
    var fn = path.resolve(__dirname,'..','package.json');
    loadFixture(fn, function(fixture) {
      assert.deepEqual(USON.parse(loadFileSync(fn), "json"), fixture);
      done();
    });
  });

  it('support custom types #1', function() {
    var types = { 
      maj: function(val){
        return val+' day';
      }
    };
    assert.deepEqual(USON.parse('maj!good', null, types), ['good day']);
  });
  it('support custom types #2', function() {
    var types = { 
      myobj: function(val){
        return 'hello '+val.name;
      }
    };
    var res = USON.parse('myobj!name:three', null, types);
    assert.deepEqual(res, ['hello three']);
  });
});
