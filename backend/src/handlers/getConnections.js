'use strict';
const controller = require('../controllers/connection');
const session = require('../middleware/session');
const response = require('../utils/response');
const errorToResponse = require('../utils/errorToResponse');
const { LOG } = require('../utils/log');

async function handler(event) {
  try {
    let payload = await session.verify(event);
    let result = await controller.getConnections(payload.userId);
    return new response.Success({ bubble: result });
  } catch (e) {
    LOG('getConnections.handler', e);
    return errorToResponse(e);
  }
};

module.exports = {
  handler
};
