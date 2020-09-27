'use strict';
const user = require('../controllers/user');
const conn = require('../controllers/connection');
const response = require('../models/response');
const validation = require('../middleware/bodyValidator');
const session = require('../middleware/session');
const { LOG } = require('../utils/log');

async function handler(event) {
  LOG('event body', event.body);

  try {
    let body = validation.login(event.body);
    let result = await user.authenticate(body.email, body.password);
    let connections = await conn.getConnections(result.userId);
    return new response.Success({
      token: await session.create({ userId: result.userId, username: result.username }),
      user: result,
      connections
    });
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
