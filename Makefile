NODE = node
PEGJS = node_modules/.bin/pegjs
BROWSERIFY = node_modules/.bin/browserify
UGLIFY = node_modules/.bin/uglifyjs
LINTER = node_modules/.bin/jshint

all: lint peg pack minify

browser: pack minify

peg: uson.pegjs
	$(PEGJS) -o speed $< dist/parser.js

pack:
	$(BROWSERIFY) --standalone USON -o dist/uson.pack.js index.js

minify:
	$(UGLIFY) -m -o dist/uson.min.js dist/uson.pack.js

bench:
	$(NODE) benchmark/benchmark.js

lint:
	$(LINTER) *.js bin/*.js

