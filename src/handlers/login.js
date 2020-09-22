'use strict';
const user = require('../controllers/user');
const response = require('../models/response');
const validation = require('../middleware/bodyValidator');
const { LOG } = require('../utils/log');

async function handler(event) {
  LOG('event body', event.body);

  try {
    let body = validation.login(event.body);
    let result = await user.authenticate(body.email, body.password);
    return new response.Success({ user: result });
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
