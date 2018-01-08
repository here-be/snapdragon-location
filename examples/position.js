const Lexer = require('snapdragon-lexer');
const Position = require('..').Position;

const lexer = new Lexer('foo/bar');
lexer.capture('text', /^\w+/);
lexer.advance();
console.log(new Position(lexer));
