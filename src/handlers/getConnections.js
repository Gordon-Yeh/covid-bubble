'use strict';
const controller = require('../controllers/connection');
const session = require('../middleware/session');
const response = require('../models/response');
const errorToResponse = require('../utils/errorToResponse');
const { LOG } = require('../utils/log');

async function handler(event) {
  LOG('event.pathParameters:', event.pathParameters);

  try {
    let payload = session.verify(event);
    let result = await controller.getConnections(payload.userId);
    return new response.Success({ connections: result });
  } catch (e) {
    return errorToResponse(e);
  }
};

module.exports = {
  handler
};
