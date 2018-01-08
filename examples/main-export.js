const location = require('..');
const Lexer = require('snapdragon-lexer');
const lexer = new Lexer('foo/bar', { source: 'string' });

lexer.capture('slash', /^\//);
lexer.capture('text', /^\w+/);

var loc = location(lexer);
var token = loc(lexer.advance());
console.log(token.loc);
// Location {
//   source: 'string',
//   start: Position { index: 0, column: 1, line: 1 },
//   end: Position { index: 3, column: 4, line: 1 } }
