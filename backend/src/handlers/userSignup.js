'use strict';
const userController = require('../controllers/user');
const response = require('../utils/response');
const validation = require('../middleware/bodyValidator');
const { LOG } = require('../utils/log');
const session = require('../middleware/session');

async function handler(event) {
  LOG('event body', event.body);

  try {
    let user = validation.userSignup(event.body);
    let result = await userController.createUser(user.email, user.password, user.firstName, user.lastName, user.username);
    let sessionToken = await session.create({ userId: result.userId, username: result.username });
    return response.success({ user: result }, sessionToken);
  } catch (e) {
    LOG(e);
    return response.errorToResponse(e);
  }
};

module.exports = {
  handler
};
