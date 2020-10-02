'use strict';
const user = require('../controllers/user');
const conn = require('../controllers/connection');
const response = require('../models/response');
const validation = require('../middleware/bodyValidator');
const session = require('../middleware/session');
const errorToResponse = require('../utils/errorToResponse');
const { LOG } = require('../utils/log');

async function handler(event) {
  LOG('event body', event.body);

  try {
    let body = validation.login(event.body);
    let result = await user.authenticate(body.email, body.password);
    let connections = await conn.getConnections(result.userId);
    let sessionToken = await session.create({ userId: result.userId, username: result.username });
    let res = new response.Success({ user: result, connections }, sessionToken);
    LOG('login.handler', 'responding with', res);
    return res;
  } catch (e) {
    LOG('login.handler', e);
    return errorToResponse(e);
  }
};

module.exports = {
  handler
};
