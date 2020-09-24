'use strict';
const user = require('../controllers/user');
const response = require('../models/response');
const validation = require('../middleware/bodyValidator');
const { LOG } = require('../utils/log');
const session = require('../middleware/session');

async function handler(event) {
  LOG('event body', event.body);

  try {
    let body = validation.userSignup(event.body);
    let result = await user.createUser(body.email, body.password, body.firstName, body.lastName);
    return new response.Success({
      token: await session.create({ userId: result.userId, username: result.username })
    });
  } catch (e) {
    if (e.name === 'validation')
      return new response.Failure(400, e.message);
    else
      return new response.Failure(500, e.message);
  }
};

module.exports = {
  handler
};
