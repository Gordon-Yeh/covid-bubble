'use strict';
const user = require('../controllers/user');
const response = require('../models/response');
const { LOG } = require('../utils/log');

async function handler(event) {
  LOG('event body', event.body);

  try {
    // let body = validUserSignup(event.body);
    let body = JSON.parse(event.body);
    let result = await user.createUser(body.email, body.password, body.firstName, body.lastName);
    return new response.Success({ user: result });
  } catch (e) {
    if (e.name === 'validation')
      return new response.Failure(400, e.message);
    else
      return new response.Failure(500, 'internal_server_error');
  }
};

module.exports = {
  handler
};
