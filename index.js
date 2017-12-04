'use strict';

/**
 * Create a new Position object with `index`, `column`,
 * and `line`
 */

class Position {
  constructor(lexer) {
    this.index = lexer.loc.index;
    this.column = lexer.loc.column;
    this.line = lexer.loc.line;
  }
}

/**
 * Create a new Location object with `start` and `end`
 * locations.
 */

class Location {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

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
 * var loc = location(lexer);
 * var token = loc(lexer.advance());
 * console.log(token);
 * ```
 * @param {Object} `lexer` Lexer instance
 * @return {Function} Returns a function that takes a `token` as its only argument
 * @api public
 */

function location(lexer) {
  if (!isLexer(lexer)) return location.plugin();
  const start = new Position(lexer);

  return (token) => {
    const end = new Position(lexer);
    token.loc = new Location(start, end);
    token.range = [start.index, end.index];
    return token;
  };
}

/**
 * Use as a plugin to add a `.location` method to your [snapdragon-lexer][]
 * instance, which automatically adds a location object to tokens when the
 * `.lex()` method is used.
 *
 * ```js
 * var Lexer = require('snapdragon-lexer');
 * var location = require('snapdragon-location');
 * var lexer = new Lexer();
 * lexer.use(location.plugin());
 * ```
 * @api public
 */

location.plugin = () => {
  return function(lexer) {
    if (!lexer.isLexer) {
      throw new Error('expected a Snapdragon.Lexer instance');
    }

    /**
     * Get the current cursor position, with `index`, `line` and `column`.
     * This is used in the [.location()](#location) method to add the "start"
     * and "end" locations to the location object, you can also call it directly
     * when needed.
     *
     * ```js
     * const Lexer = require('snapdragon-lexer');
     * const lexer = new Lexer();
     * console.log(lexer.position());
     * //=> Position { index: 0, line: 1, column: 1 };
     * ```
     * @return {Object} Returns an object with the current lexer position, with
     * cursor `index`, `line`, and `column` numbers.
     * @api public
     */

    lexer.position = () => new Position(lexer);

    /**
     * Returns a function for getting the current location.
     *
     * ```js
     * const Lexer = require('snapdragon-lexer');
     * const lexer = new Lexer('foo/bar');
     * lexer.use(location.plugin());
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
     * @return {Function} Returns a function that takes a `token` as its only argument
     * @api public
     */

    lexer.location = () => location(lexer);

    /**
     * Override the `.lex` method to automatically patch
     * location onto returned tokens in a future-proof way.
     */

    lexer.lex = (type) => {
      const loc = lexer.location();
      const tok = lexer.constructor.prototype.lex.call(lexer, type);
      if (tok) {
        return loc(tok);
      }
    };
  };
};

function isLexer(lexer) {
  return lexer && typeof lexer === 'object' && lexer.isLexer === true;
}

/**
 * Expose `Position` and `Location` classes
 */

module.exports = location;
module.exports.Position = Position;
module.exports.Location = Location;
