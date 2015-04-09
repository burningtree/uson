NODE = node
NPM = npm
PEGJS = node_modules/.bin/pegjs
BROWSERIFY = node_modules/.bin/browserify
UGLIFY = node_modules/.bin/uglifyjs
LINTER = node_modules/.bin/jshint
MOCHA = node_modules/.bin/mocha

all: build browser

install:
	$(NPM) install

build:
	@make peg lint test-silent

browser:
	@make pack minify

peg: src/uson.pegjs
	$(PEGJS) -o speed $< dist/parser.js

pack: dist/uson.pack.js
	$(BROWSERIFY) --standalone USON -o $< index.js

minify: dist/uson.pack.js
	$(UGLIFY) -m -o dist/uson.min.js $<

bench: benchmark/benchmark.js
	$(NODE) $<

lint:
	$(LINTER) index.js bin/cli.js test/index.js test/cli.js

test-silent:
	$(MOCHA) -R dot

help:
	@echo ""
	@echo " Available commands:"
	@echo "   all install build browser peg pack minify"
	@echo "   bench lint test-silent"
	@echo ""

