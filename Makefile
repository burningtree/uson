PEGJS = pegjs

peg: uson.pegjs
	$(PEGJS) $< dist/parser.js

