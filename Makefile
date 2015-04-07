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
	$(BROWSERIFY) --standalone USON index.js -o dist/uson.pack.js

minify:
	$(UGLIFY) dist/uson.pack.js -o dist/uson.min.js

bench:
	$(NODE) benchmark/benchmark.js

lint:
	$(LINTER) *.js bin/*.js

