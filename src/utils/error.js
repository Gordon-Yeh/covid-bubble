'use strict';

function ValidationError(message) {
  return CustomError('validation', message);
}

function AuthError(message) {
  return CustomError('unauthentication', message);
}

function DBError(message) {
  return CustomError('database', message)
}

function CustomError(name, message) {
  let e = new Error(message);
  e.name = name;
  return e;
}

module.exports = {
  ValidationError,
  CustomError,
  AuthError,
  DBError
}
