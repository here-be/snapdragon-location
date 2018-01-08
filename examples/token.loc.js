const location = require('..');
const Lexer = require('snapdragon-lexer');
const lexer = new Lexer('foo/bar');
lexer.use(location());

lexer.capture('slash', /^\//);
lexer.capture('text', /^\w+/);

const token = lexer.advance();
console.log(token);
