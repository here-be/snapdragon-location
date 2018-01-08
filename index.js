'use strict';

/**
 * Sets the `start` location and returns a function for setting
 * the `end` location.
 *
 * ```js
 * const location = require('snapdragon-location');
 * const Lexer = require('snapdragon-lexer');
 * const lexer = new Lexer('foo/bar');
 *
 * lexer.capture('slash', /^\//);
 * lexer.capture('text', /^\w+/);
 *
 * const loc = location(lexer);
 * const token = loc(lexer.advance());
 * console.log(token);
 * ```
 * @param {String|Object} `name` (optional) Snapdragon Lexer or Tokenizer instance, or the name to use for the location property on the token. Default is `toc`.
 * @param {Object} `target` Snapdragon Lexer or Tokenizer instance
 * @return {Function} Returns a function that takes a `token` as its only argument
 * @api public
 */

function location(name, target) {
  if (isValidInstance(name)) return location('loc', name);
  if (!isValidInstance(target)) return location.plugin(name);
  const start = new Position(target);

  return (token) => {
    token[name] = new Location(start, new Position(target), target);
    if (target.emit) target.emit('location', token);
    return token;
  };
}

/**
 * Use as a plugin to add a `.location` method to your [snapdragon-lexer][]
 * or [snapdragon-tokenizer][] instance to automatically add a location object
 * to tokens when the `.lex()` or `.handle()` methods are used.
 *
 * ```js
 * const Lexer = require('snapdragon-lexer');
 * const location = require('snapdragon-location');
 * const lexer = new Lexer();
 * lexer.use(location());
 * ```
 * @api public
 */

location.plugin = (name) => {
  if (typeof name !== 'string') name = 'loc';

  return function(target) {
    if (!isValidInstance(target)) {
      throw new Error('expected a snapdragon Lexer or Tokenizer instance');
    }

    /**
     * Get the current source position, with `index`, `column` and `line`.
     * Used by [.location()](#location) to create the "start" and "end" positions.
     *
     * ```js
     * const Lexer = require('snapdragon-lexer');
     * const lexer = new Lexer();
     * console.log(lexer.position());
     * //=> Position { index: 0, column: 0, line: 1 };
     * ```
     * @return {Object} Returns an object with the current source position.
     * @api public
     */

    target.position = () => new Position(target);

    /**
     * Returns a function for getting the current location.
     *
     * ```js
     * const Lexer = require('snapdragon-lexer');
     * const lexer = new Lexer('foo/bar');
     * lexer.use(location());
     *
     * lexer.set('text', function(tok) {
     *   // get start location before advancing lexer
     *   const loc = this.location();
     *   const match = this.match(/^\w+/);
     *   if (match) {
     *     // get end location after advancing lexer (with .match)
     *     return loc(this.token(match));
     *   }
     * });
     * ```
     * @return {Function} Returns a function that takes a `token` as its only argument, and patches a `.loc` property onto the token.
     * @api public
     */

    target.location = (key) => location(key || name, target);

    /**
     * Override the `.lex` method to automatically patch
     * location onto returned tokens in a future-proof way.
     */

    target.lex = (type) => {
      const loc = target.location();
      const tok = target.constructor.prototype.lex.call(target, type);
      if (tok) {
        return loc(tok);
      }
    };

    /**
     * Override the `.handle` method to automatically patch
     * location onto returned tokens in a future-proof way.
     */

    target.handle = (type) => {
      const loc = target.location();
      const tok = target.constructor.prototype.handle.call(target, type);
      if (tok) {
        return loc(tok);
      }
    };
  };
};

/**
 * Create a new Position object with `index`, `column`, and `line`.
 *
 * ```js
 * const Lexer = require('snapdragon-lexer');
 * const Position = require('snapdragon-location').Position;
 * const lexer = new Lexer('foo/bar');
 * lexer.capture('text', /^\w+/);
 * lexer.advance();
 * console.log(new Position(lexer));
 * //=> Position { index: 3, column: 4, line: 1 }
 * ```
 * @param {Object} `start` (required) Starting [position](#position)
 * @param {Object} `end` (required) Ending [position](#position)
 * @param {Object} `target` (optional) Snapdragon Lexer or Tokenizer instance
 * @return {Object}
 * @api public
 */

class Position {
  constructor(lexer) {
    this.index = lexer.loc.index;
    this.column = lexer.loc.column;
    this.line = lexer.loc.line;
  }
}

/**
 * Create a new Location with the given `start` and `end` positions.
 *
 * ```js
 * const Lexer = require('snapdragon-lexer');
 * const location = require('snapdragon-position');
 * const lexer = new Lexer('foo/bar')
 *   .capture('slash', /^\//)
 *   .capture('text', /^\w+/);
 *
 * const start = new location.Position(lexer);
 * lexer.advance();
 * const end = new location.Position(lexer);
 * console.log(new location.Location(start, end, lexer));
 * // Location {
 * //   source: undefined,
 * //   start: Position { index: 0, column: 1, line: 1 },
 * //   end: Position { index: 3, column: 4, line: 1 } }
 * ```
 * @param {Object} `start` (required) Starting [position](#position)
 * @param {Object} `end` (required) Ending [position](#position)
 * @param {Object} `target` (optional) Snapdragon Lexer or Tokenizer instance
 * @return {Object}
 * @api public
 */

class Location {
  constructor(start, end, target) {
    this.source = isValidInstance(target) ? target.options.source : undefined;
    this.start = start;
    this.end = end;
  }
  get range() {
    return [this.start.index, this.end.index];
  }
}

/**
 * Returns true if `target` is an instance of snapdragon lexer or tokenizer
 */

function isValidInstance(target) {
  if (isObject(target)) {
    return target.isLexer === true || target.isTokenizer === true;
  }
  return false;
}

function isObject(target) {
  return target && typeof target === 'object';
}

/**
 * Main export
 */

module.exports = location;

/**
 * Expose `Location` and `Position` classes as properties on main export
 */

module.exports.Location = Location;
module.exports.Position = Position;
