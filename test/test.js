'use strict';

require('mocha');
const use = require('use');
const assert = require('assert');
const Lexer = require('./support/lexer');
const location = require('..');
let lexer;

class Token {}

describe('snapdragon-location', function() {
  beforeEach(function() {
    lexer = new Lexer({Token: Token});
    lexer.use(location());
  });

  it('should export a function', function() {
    assert.equal(typeof location, 'function');
  });

  it('should work when passed to a Token', function() {
    var pos = lexer.location();
    var token = pos(new Token({type: 'nothing'}));

    assert(token.loc);
    assert(token.loc.start);
    assert.equal(token.loc.start.line, 1);
    assert.equal(token.loc.start.column, 1);

    assert(token.loc.end);
    assert.equal(token.loc.end.line, 1);
    assert.equal(token.loc.end.column, 1);
  });

  it('should work when called on a token instance', function() {
    var pos = lexer.location();
    var token = new Token({type: 'nothing'});
    pos(token)

    assert(token.loc);
    assert(token.loc.start);
    assert.equal(token.loc.start.line, 1);
    assert.equal(token.loc.start.column, 1);

    assert(token.loc.end);
    assert.equal(token.loc.end.line, 1);
    assert.equal(token.loc.end.column, 1);
  });

  it('should create a new Token with the given location and val', function() {
    var pos = lexer.location();
    var tok = pos({});

    assert(tok.loc);
    assert(tok.loc.start);
    assert.equal(tok.loc.start.line, 1);
    assert.equal(tok.loc.start.column, 1);

    assert(tok.loc.end);
    assert.equal(tok.loc.end.line, 1);
    assert.equal(tok.loc.end.column, 1);
  });

  it('should patch line number onto token.loc', function() {
    lexer.input = 'abc\nmno\nxyx';
    lexer.capture('slash', /^\//);
    lexer.capture('star', /^\*/);
    lexer.capture('text', /^\w+/);
    lexer.capture('dot', /^\./);
    lexer.capture('newline', /^\n/);

    assert.deepEqual(lexer.advance().loc, {
      start: {
        index: 0,
        column: 1,
        line: 1
      },
      end: {
        index: 3,
        column: 4,
        line: 1
      }
    });

    assert.deepEqual(lexer.advance().loc, {
      start: {
        index: 3,
        column: 4,
        line: 1
      },
      end: {
        index: 4,
        column: 1,
        line: 2
      }
    });

    assert.deepEqual(lexer.advance().loc, {
      start: {
        index: 4,
        column: 1,
        line: 2
      },
      end: {
        index: 7,
        column: 4,
        line: 2
      }
    });

    assert.deepEqual(lexer.advance().loc, {
      start: {
        index: 7,
        column: 4,
        line: 2
      },
      end: {
        index: 8,
        column: 1,
        line: 3
      }
    });

    assert.deepEqual(lexer.advance().loc, {
      start: {
        index: 8,
        column: 1,
        line: 3
      },
      end: {
        index: 11,
        column: 4,
        line: 3
      }
    });
  });
});
