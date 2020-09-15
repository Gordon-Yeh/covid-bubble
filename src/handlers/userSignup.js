'use strict';
const { createUser } = require('../controllers/user');
const { LOG } = require('../log');

async function handler(event) {
  let body = JSON.parse(event.body);
  LOG('event body', body);

  try {
    let result = await createUser(body.email, body.password, body.firstName, body.lastName);
    return {
      statusCode: 200,
      body: JSON.stringify({
        user: result
      })
    };
  } catch (e) {
    return {
      statusCode: 400,
      message: e.message
    };
  }
};

module.exports = {
  handler
};