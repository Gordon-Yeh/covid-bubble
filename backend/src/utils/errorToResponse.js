'use strict';

const { Failure } = require('../models/response');

function errorToResponse(err) {
  if (e.name === 'validation')
    return new Failure(400, e.message);
  else if (e.name === 'unauthentication')
    return new Failure(401, e.message);
  else
    return new Failure(500, 'internal_server_error');
}

module.exports = errorToResponse;