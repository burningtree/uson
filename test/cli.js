'use strict';

var fs = require('fs');
var assert = require('assert');
var path = require('path');

describe('test/cli', function() {

  var nodeBin = 'node ' + path.resolve(__dirname, '..', 'bin/cli.js');
  function bin(query, cb) {
    require('child_process').exec(nodeBin + ' ' + query, cb);
  }

  it('should work with string', function(done) {
    bin('hello', function(err, data) {
      assert.deepEqual(data, '[\"hello\"]\n');
      assert.equal(err, null);
      done();
    });
  });

  it('should work with quoted', function(done) {
    bin('\\\'blue velvet\\\'', function(err, data) {
      assert.deepEqual(data, '["blue velvet"]\n');
      assert.equal(err, null);
      done();
    });
  });

  it('should work with array', function(done) {
    bin('hello dolly', function(err, data) {
      assert.deepEqual(data, '["hello","dolly"]\n');
      assert.equal(err, null);
      done();
    });
  });

  it('should work in object mode', function(done) {
    bin('-o a:1', function(err, data) {
      assert.deepEqual(data, '{"a":1}\n');
      assert.equal(err, null);
      done();
    });
  });

  it('should work in json mode', function(done) {
    bin('-j a:1 xx', function(err, data) {
      assert.deepEqual(data, '{"a":1}\n');
      assert.equal(err, null);
      done();
    });
  });

  it('should work and output to yaml', function(done) {
    bin('-y a:1 xx', function(err, data) {
      assert.deepEqual(data, '- a: 1\n- xx\n');
      assert.equal(err, null);
      done();
    });
  });

  it('should work and output to hex encoding', function(done) {
    bin('--hex a:1 xx', function(err, data) {
      assert.deepEqual(data, '5b7b2261223a317d2c227878225d0a\n');
      assert.equal(err, null);
      done();
    });
  });

  it('should work and output to base64 encoding', function(done) {
    bin('--base64 a:1 xx', function(err, data) {
      assert.deepEqual(data, 'W3siYSI6MX0sInh4Il0K\n');
      assert.equal(err, null);
      done();
    });
  });

  it('should work with input file', function(done) {
    var dir = path.resolve(__dirname, '../');
    var file = 'package.json';
    bin('-j -i '+file, function(err, data) {
      var good = JSON.parse(fs.readFileSync(path.join(dir, file)));
      assert.deepEqual(JSON.parse(data), good);
      assert.equal(err, null);
      done();
    });
  });

  it('should work with custom usorc.js file', function(done) {
    var file = path.resolve(__dirname, 'fixtures', 'usonrc.js');
    bin('-u '+file+' \'js!"29.66+(37.02/3)"\'', function(err, data) {
      assert.deepEqual(JSON.parse(data), [42]);
      assert.equal(err, null);
      done();
    });
  });
});

