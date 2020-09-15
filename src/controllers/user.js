'use strict';
const Database = require('../db');
const { LOG } = require('../log');
const { v4: uuid } = require('uuid');
var db = new Database();

async function createUser(email, password, first_name, last_name) {
  LOG('createUser:', `adding new user with email=${email}, password=${password}, firstName=${first_name}, lastName=${last_name}`);

  let newUser = {
    user_id: 'user_id1',
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
    throw e;
  }
}

module.exports = {
  createUser,
};