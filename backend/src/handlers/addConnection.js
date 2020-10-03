'use strict';
const controller = require('../controllers/connection');
const response = require('../utils/response');
const validation = require('../middleware/bodyValidator');
const session = require('../middleware/session');
const errorToResponse = require('../utils/errorToResponse');
const { LOG } = require('../utils/log');

async function handler(event) {
  LOG('event body', event.body);

  try {
    let payload = await session.verify(event);
    let body = validation.addConnections(event.body);
    await controller.addConnections(payload.userId, body);
    let connections = await controller.getConnections(payload.userId);
    let res = response.success(event, { bubble: connections })
    LOG('addConnection.handler:', 'respond with', res);
    return res;
  } catch (e) {
    LOG(e);
    return errorToResponse(e);
  }
};

module.exports = {
  handler
};
