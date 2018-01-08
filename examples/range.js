const util = require('util');
const Lexer = require('snapdragon-lexer');
const lexer = new Lexer('foo/*');
const location = require('..');
lexer.use(location());
lexer.capture('star', /^\*/);
lexer.capture('slash', /^\//);
lexer.capture('text', /^\w+/);

lexer.tokenize();
console.log(util.inspect(lexer.tokens, {depth: null}));
console.log(lexer.input.slice(...lexer.tokens[0].loc.range));
console.log(lexer.input.slice(...lexer.tokens[1].loc.range));
console.log(lexer.input.slice(...lexer.tokens[2].loc.range));

