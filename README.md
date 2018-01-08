# snapdragon-location [![NPM version](https://img.shields.io/npm/v/snapdragon-location.svg?style=flat)](https://www.npmjs.com/package/snapdragon-location) [![NPM monthly downloads](https://img.shields.io/npm/dm/snapdragon-location.svg?style=flat)](https://npmjs.org/package/snapdragon-location) [![NPM total downloads](https://img.shields.io/npm/dt/snapdragon-location.svg?style=flat)](https://npmjs.org/package/snapdragon-location) [![Linux Build Status](https://img.shields.io/travis/here-be/snapdragon-location.svg?style=flat&label=Travis)](https://travis-ci.org/here-be/snapdragon-location)

> Adds a location object to snapdragon token or AST node.

Please consider following this project's author, [Jon Schlinkert](https://github.com/jonschlinkert), and consider starring the project to show your :heart: and support.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save snapdragon-location
```

## What does this do?

Adds a `.loc` object to tokens that looks something like this:

```js
{
  source: 'string',
  start: { index: 0, column: 1, line: 1 },
  end: { index: 3, column: 4, line: 1 },
  range: [0, 3] // getter
}
```

When used as [snapdragon-lexer](https://github.com/here-be-snapdragons/snapdragon-lexer) plugin, this adds a `.location()` method to the instance and patches the `lexer.lex()` and `lexer.handle()` methods to automatically add [location objects](#location-objects) to tokens.

There is a more [detailed example](#example-usage) below.

**Heads up!**

If you prefer `.position` over `.loc`, use [snapdragon-position](https://github.com/here-be/snapdragon-position) instead.

## API

The main export is a function that can either be called directly with a `token` to add a `.loc` object to the token, or used as a plugin function with `lexer.use()`.

### [location](index.js#L25)

Sets the `start` location and returns a function for setting the `end` location.

**Params**

* `name` **{String|Object}**: (optional) Snapdragon Lexer or Tokenizer instance, or the name to use for the location property on the token. Default is `toc`.
* `target` **{Object}**: Snapdragon Lexer or Tokenizer instance
* `returns` **{Function}**: Returns a function that takes a `token` as its only argument

**Example**

```js
const location = require('snapdragon-location');
const Lexer = require('snapdragon-lexer');
const lexer = new Lexer('foo/bar');

lexer.capture('slash', /^\//);
lexer.capture('text', /^\w+/);

var loc = location(lexer);
var token = loc(lexer.advance());
console.log(token);
```

### [.plugin](index.js#L51)

Use as a plugin to add a `.location` method to your [snapdragon-lexer](https://github.com/here-be-snapdragons/snapdragon-lexer) or [snapdragon-tokenizer][] instance to automatically add a location object to tokens when the `.lex()` or `.handle()` methods are used.

**Example**

```js
var Lexer = require('snapdragon-lexer');
var location = require('snapdragon-location');
var lexer = new Lexer();
lexer.use(location());
```

### [.position](index.js#L73)

Get the current source position, with `index`, `column` and `line`. Used by [.location()](#location) to create the "start" and "end" positions.

* `returns` **{Object}**: Returns an object with the current source position.

**Example**

```js
const Lexer = require('snapdragon-lexer');
const lexer = new Lexer();
console.log(lexer.position());
//=> Position { index: 0, column: 0, line: 1 };
```

### [.location](index.js#L97)

Returns a function for getting the current location.

* `returns` **{Function}**: Returns a function that takes a `token` as its only argument, and patches a `.loc` property onto the token.

**Example**

```js
const Lexer = require('snapdragon-lexer');
const lexer = new Lexer('foo/bar');
lexer.use(location());

lexer.set('text', function(tok) {
  // get start location before advancing lexer
  const loc = this.location();
  const match = this.match(/^\w+/);
  if (match) {
    // get end location after advancing lexer (with .match)
    return loc(this.token(match));
  }
});
```

**Params**

* `start` **{Object}**: (required) Starting [position](#position)
* `end` **{Object}**: (required) Ending [position](#position)
* `target` **{Object}**: (optional) Snapdragon Lexer or Tokenizer instance
* `returns` **{Object}**

**Example**

```js
const Lexer = require('snapdragon-lexer');
const Position = require('snapdragon-location').Position;
const lexer = new Lexer('foo/bar');
lexer.capture('text', /^\w+/);
lexer.advance();
console.log(new Position(lexer));
//=> Position { index: 3, column: 4, line: 1 }
```

**Params**

* `start` **{Object}**: (required) Starting [position](#position)
* `end` **{Object}**: (required) Ending [position](#position)
* `target` **{Object}**: (optional) Snapdragon Lexer or Tokenizer instance
* `returns` **{Object}**

**Example**

```js
const Lexer = require('snapdragon-lexer');
const location = require('snapdragon-position');
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
```

## Token objects

See the [Token documentation](https://github.com/here-be/snapdragon-token/blob/master/README.md#token-object) for more details about the `Token` object.

```js
interface Token {
  type: string;
  value: string;
  match: array | undefined;
  loc: Location;
}
```

## Location objects

The `token.loc` property contains source string location information on the token.

```js
interface Location {
  source: string | undefined;
  start: Position;
  end: Position;
  range: array (getter)
}
```

* `source` **{string|undefined}** - the source location provided by `lexer.options.source`. Typically this is a filename, but could also be `string` or any user defined value.
* `start` **{object}** - start [position object](#position-objects), which is the position of the _first character of_ the lexed source string.
* `end` **{object}** - end [position object](#position-objects), which is the position of the _last character of_ the lexed source string.
* `range` **{array}** - getter that returns an array with the following values: `[loc.start.index, loc.end.index]`

## Position objects

Each `Position` object consists of an `index` number (0-based), a `column` number (0-based), and a `line` number (1-based):

```js
interface Position {
  index: number; // >= 0
  column: number; // >= 0,
  line: number; // >= 1
}
```

* `line` **{string|undefined}** - the source location provided by `lexer.options.source`. Typically this is a filename, but could also be `string` or any user defined value.
* `column` **{object}** - start [position object](#position-objects), which is the position of the _first character of_ the lexed source string.
* `end` **{object}** - end [position object](#position-objects), which is the position of the _last character of_ the lexed source string.

## Example usage

```js
const Lexer = require('snapdragon-lexer');
const lexer = new Lexer('foo/*', { source: 'string' });
lexer.use(location());
lexer.capture('star', /^\*/);
lexer.capture('slash', /^\//);
lexer.capture('text', /^\w+/);

lexer.tokenize();
console.log(lexer.tokens);
```

Results in:

```js
[
  {
    type: 'text',
    val: 'foo',
    match: ['foo', index: 0, input: 'foo/*'],
    loc: {
      source: 'string',
      start: { index: 0, column: 1, line: 1 },
      end: { index: 3, column: 4, line: 1 },
      range: [0, 3]
    }
  },
  {
    type: 'slash',
    val: '/',
    match: ['/', index: 0, input: '/*'],
    loc: {
      source: 'string',
      start: { index: 3, column: 4, line: 1 },
      end: { index: 4, column: 5, line: 1 },
      range: [3, 4]
    }
  },
  {
    type: 'star',
    val: '*',
    match: ['*', index: 0, input: '*'],
    loc: {
      source: 'string',
      start: { index: 4, column: 5, line: 1 },
      end: { index: 5, column: 6, line: 1 },
      range: [4, 5]
    }
  }
]
```

## About

<details>
<summary><strong>Contributing</strong></summary>

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](.github/contributing.md) for advice on opening issues, pull requests, and coding standards.

</details>

<details>
<summary><strong>Running Tests</strong></summary>

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

</details>
<details>
<summary><strong>Building docs</strong></summary>

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

</details>

### Related projects

You might also be interested in these projects:

* [snapdragon-capture](https://www.npmjs.com/package/snapdragon-capture): Snapdragon plugin that adds a capture method to the parser instance. | [homepage](https://github.com/jonschlinkert/snapdragon-capture "Snapdragon plugin that adds a capture method to the parser instance.")
* [snapdragon-node](https://www.npmjs.com/package/snapdragon-node): Snapdragon utility for creating a new AST node in custom code, such as plugins. | [homepage](https://github.com/jonschlinkert/snapdragon-node "Snapdragon utility for creating a new AST node in custom code, such as plugins.")
* [snapdragon-util](https://www.npmjs.com/package/snapdragon-util): Utilities for the snapdragon parser/compiler. | [homepage](https://github.com/jonschlinkert/snapdragon-util "Utilities for the snapdragon parser/compiler.")

### Author

**Jon Schlinkert**

* [linkedin/in/jonschlinkert](https://linkedin.com/in/jonschlinkert)
* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2018, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on January 08, 2018._