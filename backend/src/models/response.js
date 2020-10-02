'use strict';

const { stringifyToken } = require('../utils/cookies');

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
  this.body = JSON.stringify({ error: message });
}

module.exports = {
  Success,
  Failure
};
