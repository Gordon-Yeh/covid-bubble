'use strict';

function ValidationError(message) {
  let e = new Error(message);
  e.name = 'validation';
  return e;
}

function CustomError(name, message) {
  let e = new Error(message);
  e.name = name;
  return e;
}

module.exports = {
  ValidationError,
  CustomError
}
