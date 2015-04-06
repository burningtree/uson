var fs = require('fs');
var path = require('path');
var assert = require('assert');
var USON = require('../');

// Compliance tests that aren't supported yet.
var notImplementedYet = [];

function endsWith(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

var listing = fs.readdirSync('test/compliance');
for (var i = 0; i < listing.length; i++) {
    var filename = 'test/compliance/' + listing[i];
    if (fs.statSync(filename).isFile() && endsWith(filename, '.json') &&
        notImplementedYet.indexOf(path.basename(filename)) === -1) {
        addTestSuitesFromFile(filename);
    }
}

function addTestSuitesFromFile(filename) {
    describe(filename, function() {
        var spec = JSON.parse(fs.readFileSync(filename, 'utf-8'));
        var modes = [ 'array', 'object' ];
        var errorMsg;
        for (var i = 0; i < spec.length; i++) {
            var msg = "suite " + i + " for filename " + filename;
            describe(msg, function() {
                var given = spec[i].given;
                var cases = spec[i].cases;
                for (var j = 0; j < cases.length; j++) {
                  var testcase = cases[j];
                  for (var k = 0; k < modes.length; k++) {
                    var mode = modes[k];
                    if (testcase.error !== undefined) {
                        // For now just verify that an error is thrown
                        // for error tests.
                        (function(testcase, given) {
                          it('should throw error for test ' + j, function() {
                              assert.throws(
                                  function() {
                                    search(given, testcase.expression);
                                  }, Error, testcase.expression);
                          });
                        })(testcase, given);
                    } else {
                        (function(mode, testcase, given) {
                          it('should pass test ' + j + " in mode '"+mode+"' expression: " + testcase.expression, function() {
                              assert.deepEqual(USON.parse(testcase.expression,{mode:mode}),
                                               testcase.result[mode]);
                          });
                        })(mode, testcase, given);
                    }
                  }
                }
            });
        }
    });
}
