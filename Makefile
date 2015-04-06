PEGJS = pegjs

peg: uson.pegjs
	$(PEGJS) -o speed $< dist/parser.js

