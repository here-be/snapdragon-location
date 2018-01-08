const Lexer = require('snapdragon-lexer');
const location = require('..');
const lexer = new Lexer('foo/bar')
  .capture('slash', /^\//)
  .capture('text', /^\w+/);

const start = new location.Position(lexer);
lexer.advance();
const end = new location.Position(lexer);
console.log(new location.Location(start, end, lexer));
// Location {
//   source: undefined,
//   start: Position { index: 0, column: 1, line: 1 },
//   end: Position { index: 3, column: 4, line: 1 } }
