'use strict';

const { stringifyToken } = require('./cookies');

function Success(body, token=null) {
  this.headers = {};
  if (token) {
    this.headers['Set-Cookie'] = stringifyToken(token);
    this.headers['Access-Control-Allow-Origin'] = '*';
  }
  this.statusCode = 200;
  this.body = JSON.stringify(body);
}

function Failure(status, message) {
  this.statusCode = status;
  this.body = JSON.stringify({ message });
}

function success(body, token=null) {
  return new Success(body, token);
}

function errorToResponse(err) {
  if (err.name === 'validation')
    return new Failure(400, err.message);
  else if (err.name === 'unauthentication')
    return new Failure(401, err.message);
  else
    return new Failure(500, 'internal_server_error');
}

module.exports = {
  Success,
  Failure,
  success,
  errorToResponse
};
