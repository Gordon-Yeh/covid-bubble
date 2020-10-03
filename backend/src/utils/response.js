'use strict';

const { stringifyToken } = require('./cookies');
const { LOG } = require('./log');

function Success(body, origin, token=null) {
  this.headers = {
    // allows other addresses different than the server's to make requests
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    'Access-Control-Allow-Credentials': true
  };
  if (token) {
    this.headers['Set-Cookie'] = stringifyToken(token);
  }
  this.statusCode = 200;
  this.body = JSON.stringify(body);
}

function Failure(status, message) {
  this.statusCode = status;
  this.body = JSON.stringify({ message });
}

function success(event, body, token=null) {
  return new Success(body, event.headers.origin, token);
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
