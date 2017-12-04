# snapdragon-position [![NPM version](https://img.shields.io/npm/v/snapdragon-position.svg?style=flat)](https://www.npmjs.com/package/snapdragon-position) [![NPM monthly downloads](https://img.shields.io/npm/dm/snapdragon-position.svg?style=flat)](https://npmjs.org/package/snapdragon-position) [![NPM total downloads](https://img.shields.io/npm/dt/snapdragon-position.svg?style=flat)](https://npmjs.org/package/snapdragon-position) [![Linux Build Status](https://img.shields.io/travis/here-be-snapdragons/snapdragon-position.svg?style=flat&label=Travis)](https://travis-ci.org/here-be-snapdragons/snapdragon-position)

> Snapdragon util and plugin for patching the position on an AST node.

Please consider following this project's author, [Jon Schlinkert](https://github.com/jonschlinkert), and consider starring the project to show your :heart: and support.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save snapdragon-position
```

## What does this do?

When used as a plugin, this adds a `.position()` method to a [snapdragon-lexer][] instance, for adding [position information](#position-information) to tokens.

**Example**

```js
const position = require('snapdragon-position');
const Lexer = require('snapdragon-lexer');
const lexer = new Lexer('foo/bar');
lexer.use(position());

lexer.capture('slash', /^\//);
lexer.capture('text', /^\w+/);

var token = lexer.advance();
console.log(token);
```

Adds a `.position` object to the token, like this:

```js
Token {
  type: 'text',
  val: 'foo',
  match: [ 'foo', index: 0, input: 'foo/*' ],
  position: {
    start: { index: 0, column: 1, line: 1 },
    end: { index: 3, column: 4, line: 1 },
    range: [0, 3] // range is a getter
  } 
}
```

## Usage

The main export is a function that can either be called directly to add a `.position` to a single token, or used as a plugin function with `lexer.use()`.

### [position](index.js#L52)

Sets the `start` location and returns a function for setting the `end` location.

**Params**

* `lexer` **{Object}**: Lexer instance
* `returns` **{Function}**: Returns a function that takes a `token` as its only argument

**Example**

```js
const position = require('snapdragon-position');
const Lexer = require('snapdragon-lexer');
const lexer = new Lexer('foo/bar');

lexer.capture('slash', /^\//);
lexer.capture('text', /^\w+/);

var pos = position(lexer);
var token = pos(lexer.advance());
console.log(token);
```

### [.plugin](index.js#L79)

Alternatively, you can use the main export as a plugin to add a `.position` method to your [snapdragon-lexer][] instance, which automatically adds a position object to tokens when the `.lex()` method is used.

**Example**

```js
var Lexer = require('snapdragon-lexer');
var position = require('snapdragon-position');
var lexer = new Lexer();
lexer.use(position());
// or
lexer.use(position.plugin());
```

### [.location](index.js#L102)

Get the current cursor location, with `index`, `line` and `column`. This is used in the [.position()](#position) method to add the "start" and "end" locations to the position object, you can also call it directly when needed.

* `returns` **{Object}**: Returns an object with the current lexer location, with cursor `index`, `line`, and `column` numbers.

**Example**

```js
const Lexer = require('snapdragon-lexer');
const lexer = new Lexer();
console.log(lexer.location());
//=> Location { index: 0, line: 1, column: 1 };
```

### [.position](index.js#L126)

Returns a function for getting the current position.

* `returns` **{Function}**: Returns a function that takes a `token` as its only argument

**Example**

```js
const Lexer = require('snapdragon-lexer');
const lexer = new Lexer('foo/bar');
lexer.use(position());

lexer.set('text', function(tok) {
  // get start position before advancing lexer
  const pos = this.position();
  const match = this.match(/^\w+/);
  if (match) {
    // get end position after advancing lexer (with .match)
    return pos(this.token(match));
  }
});
```

## Position information

```js
Position {
  start: Location { index: 0, column: 1, line: 1 },
  end: Location { index: 3, column: 4, line: 1 },
  range: [getter] // [start.index, end.index]
} 
```

## Customization

### Use .loc instead of .position

Currently no options are supported for this, but you can easily patch the `Token` used by the lexer.

**Example**

```js
const Lexer = require('snapdragon-lexer');
const lexer = new Lexer();

Object.defineProperty(lexer.Token.prototype, 'tok', {
  get: function() {
    return this.position;
  }
});
```

### Set .range on token

Currently, range is a getter on `token.position.range`. If you want `range` to be on the token, instead of `token.position`, you will need to patch the Token prototype.

```js
const Lexer = require('snapdragon-lexer');
const lexer = new Lexer();

Object.defineProperty(lexer.Token.prototype, 'range', {
  get: function() {
    return this.position.range;
  }
});
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
* [snapdragon](https://www.npmjs.com/package/snapdragon): Easy-to-use plugin system for creating powerful, fast and versatile parsers and compilers, with built-in source-map… [more](https://github.com/jonschlinkert/snapdragon) | [homepage](https://github.com/jonschlinkert/snapdragon "Easy-to-use plugin system for creating powerful, fast and versatile parsers and compilers, with built-in source-map support.")

### Author

**Jon Schlinkert**

* [linkedin/in/jonschlinkert](https://linkedin.com/in/jonschlinkert)
* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2017, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on November 30, 2017._