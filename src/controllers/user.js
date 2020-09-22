'use strict';
const Database = require('../db');
const { LOG } = require('../utils/log');
const id = require('../utils/id');
const { DBError, AuthError } = require('../utils/error');
var db = new Database();

async function createUser(email, password, firstName, lastName) {
  LOG('createUser:', `adding new user with email=${email}, password=${password}, firstName=${firstName}, lastName=${lastName}`);

  // TODO: hash password with salt; look into how to best generate and store salt ,
  let newUser = [id.genUserId(), email, firstName, lastName, password];

  try {
    // TODO: make sure this syntax SQL escape the fields
    await db.query('INSERT INTO Users VALUES (?, ?, ?, ?, ?)', newUser);
    // TODO: parse result from db and result something more presentable
    return { userId: newUser[0], email, firstName, lastName };
  } catch (e) {
    if (db.isDupEmailError(e)) {
      LOG('createUser:', 'duplicate email', email);
      throw DBError('duplicate_email')
    }
    LOG('createUser:', 'error while querying db', e);
    throw DBError('database_error');
  }
}

async function authenticate(email, password) {
  LOG('authenticate:', `email=${email}, password=${password}`);
  let results;
  try {
    results = await db.query('SELECT user_id, first_name, last_name FROM Users WHERE email=? AND password=?', [email, password]);
  } catch (e) {
    LOG('authenticate:', 'error while querying db', e);
    throw DBError('database_error');
  }
  if (results.length < 1) {
    LOG('authenticate: no match found');
    throw AuthError('invalid_credentials');
  }
  return {
    userId: results[0].user_id,
    firstName: results[0].first_name,
    lastName: results[0].last_name,
    email
  };
}

module.exports = {
  createUser,
  authenticate
};