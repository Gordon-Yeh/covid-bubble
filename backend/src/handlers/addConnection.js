'use strict';
const controller = require('../controllers/connection');
const response = require('../models/response');
const validation = require('../middleware/bodyValidator');
const session = require('../middleware/session');
const errorToResponse = require('../utils/errorToResponse');
const { LOG } = require('../utils/log');

async function handler(event) {
  LOG('event body', event.body);

  try {
    let payload = await session.verify(event);
    let body = validation.addConnections(event.body);
    let result = await controller.addConnections(payload.userId, body.connections);
    return new response.Success({ connections: result });
  } catch (e) {
    return errorToResponse(e);
  }
};

module.exports = {
  handler
};
