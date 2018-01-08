'use strict';

const Token = require('./token');
const Emitter = require('@sellside/emitter');
const use = require('use');

class Lexer extends Emitter {
  constructor(input, options) {
    super();
    if (typeof input !== 'string') {
      options = input;
      input = '';
    }
    this.isLexer = true;
    this.options = Object.assign({Token: Token}, options);
    this.Token = this.options.Token;
    this.handlers = {};
    this.types = [];
    this.loc = { index: 0, column: 0, line: 1 };
    this.tokens = [];
    this.consumed = '';
    this.input = input;
    use(this);
  }
  updatePosition(val) {
    var len = val.length;
    this.consumed += val;
    this.input = this.input.slice(len);
    var lines = val.match(/\n/g);
    var index = val.lastIndexOf('\n');
    if (lines) this.loc.line += lines.length;
    this.loc.column = ~index ? len - index : this.loc.column + len;
    this.loc.index += len;
    return this;
  }
  handle(type) {
    return this.handlers[type].call(this);
  }
  lex(type) {
    return this.handlers[type].call(this);
  }
  advance() {
    for (var i = 0; i < this.types.length; i++) {
      var tok = this.handle(this.types[i]);
      if (tok) return tok;
    }
  }
  capture(type, re) {
    this.types.push(type);
    this.handlers[type] = () => {
      var match = re.exec(this.input);
      if (match) {
        this.updatePosition(match[0]);
        return new this.Token(type, match[0]);
      }
    };
  }
  tokenize(input) {
    this.input = this.string = input;
    while (this.input) this.tokens.push(this.advance());
    return this.tokens;
  }
}

/**
 * Expose `Lexer`
 */

module.exports = Lexer;
