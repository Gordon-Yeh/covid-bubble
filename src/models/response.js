'use strict';

function Success(body) {
  this.statusCode = 200;
  this.body = JSON.stringify(body);
}

function Failure(status, message) {
  this.statusCode = status;
  this.message = message;
}

module.exports = {
  Success,
  Failure
};
