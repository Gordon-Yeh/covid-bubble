'use strict';
const controller = require('../controllers/connection');
const response = require('../models/response');
const { LOG } = require('../utils/log');

async function handler(event) {
  LOG('event.pathParameters:', event.pathParameters);

  try {
    let result = await controller.getConnections(event.pathParameters.userId);
    return new response.Success({ connections: result });
  } catch (e) {
    if (e.name === 'validation')
      return new response.Failure(400, e.message);
    else if (e.name === 'unauthentication')
      return new response.Failure(401, e.message);
    else
      return new response.Failure(500, 'internal_server_error');
  }
};

module.exports = {
  handler
};
