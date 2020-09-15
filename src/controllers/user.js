'use strict';
const Database = require('../db');
const { LOG } = require('../utils/log');
const id = require('../utils/id');
var db = new Database();

async function createUser(email, password, first_name, last_name) {
  LOG('createUser:', `adding new user with email=${email}, password=${password}, firstName=${first_name}, lastName=${last_name}`);

  let newUser = {
    user_id: id.genUserId(),
    email: email,
    password,
    first_name,
    last_name
  }

  try {
    let results = await db.query('INSERT INTO Users SET ?', newUser);
    return results;
  } catch (e) {
    LOG('createUser:', 'error while querying db', e);
    throw new Error('database_error');
  }
}

module.exports = {
  createUser,
};