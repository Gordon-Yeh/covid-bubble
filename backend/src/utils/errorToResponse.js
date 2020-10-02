'use strict';

const { Failure } = require('./response');

function errorToResponse(err) {
  if (err.name === 'validation')
    return new Failure(400, err.message);
  else if (err.name === 'unauthentication')
    return new Failure(401, err.message);
  else
    return new Failure(500, 'internal_server_error');
}

module.exports = errorToResponse;