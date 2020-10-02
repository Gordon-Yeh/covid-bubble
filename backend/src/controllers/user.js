'use strict';
const Database = require('../db');
const { LOG } = require('../utils/log');
const id = require('../utils/id');
const { DBError, AuthError } = require('../utils/error');
var db = new Database();

async function createUser(email, password, firstName, lastName, username) {
  LOG('createUser:', `adding new user with email=${email}, password=${password}, firstName=${firstName}, lastName=${lastName}, username=${username}`);

  // TODO: hash password with salt; look into how to best generate and store salt ,
  let newUser = [id.genUserId(), email, firstName, lastName, password, username];

  try {
    // TODO: make sure this syntax SQL escape the fields
    await db.query('INSERT INTO Users (user_id, email, first_name, last_name, password, username) VALUES (?, ?, ?, ?, ?, ?)', newUser);
    // TODO: parse result from db and result something more presentable
    return { id: newUser[0], email, firstName, lastName, username };
  } catch (e) {
    if (db.isDupEmailError(e)) {
      LOG('createUser:', 'duplicate email', email);
      throw DBError('duplicate_email');
    } else if (db.isDupUsernameError(e)) {
      LOG('createUser:', 'duplicate username', username);
      throw DBError('duplicate_username');
    }
    LOG('createUser:', 'error while querying db', e);
    throw DBError('database_error');
  }
}

async function authenticate(email, password) {
  LOG('authenticate:', `email=${email}, password=${password}`);
  let results;
  try {
    results = await db.query('SELECT user_id, first_name, last_name, username FROM Users WHERE email=? AND password=?', [email, password]);
  } catch (e) {
    LOG('authenticate:', 'error while querying db', e);
    throw DBError('database_error');
  }
  if (results.length < 1) {
    LOG('authenticate: no match found');
    throw AuthError('invalid_credentials');
  }
  return {
    id: results[0].user_id,
    firstName: results[0].first_name,
    lastName: results[0].last_name,
    username: results[0].username,
    email
  };
}

module.exports = {
  createUser,
  authenticate
};