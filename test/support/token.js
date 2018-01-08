'use strict';

module.exports = class Token {
  constructor(type, val) {
    this.type = type;
    this.value = val;
  }
};
