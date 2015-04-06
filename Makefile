PEGJS = node_modules/.bin/pegjs
BROWSERIFY = node_modules/.bin/browserify
UGLIFY =  node_modules/.bin/uglifyjs

all: peg pack minify

peg: uson.pegjs
	$(PEGJS) -o speed $< dist/parser.js

pack:
	$(BROWSERIFY) --standalone USON index.js -o dist/uson.pack.js

minify:
	$(UGLIFY) dist/uson.pack.js -o dist/uson.min.js

