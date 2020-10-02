'use strict';
const userController = require('../controllers/user');
const conn = require('../controllers/connection');
const response = require('../utils/response');
const validation = require('../middleware/bodyValidator');
const session = require('../middleware/session');
const errorToResponse = require('../utils/errorToResponse');
const { LOG } = require('../utils/log');

async function handler(event) {
  LOG('event body', event.body);

  try {
    let body = validation.login(event.body);
    let user = await userController.authenticate(body.email, body.password);
    let connections = await conn.getConnections(user.id);
    let sessionToken = await session.create({ userId: user.id, username: user.username });
    let res = new response.Success({ user, bubble: connections }, sessionToken);
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
