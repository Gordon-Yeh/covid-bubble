'use strict';

const jwt = require('jsonwebtoken');
const { AuthError, InternalError } = require('../utils/error');
const _cookie = require('../utils/cookies');
const { LOG } = require('../utils/log');

async function verify(event) {
  // expecting format 
  // header.cookie: "session:${jwt};"
  LOG('event:', event);
  let cookies = _cookie.parse(event.headers.cookie ? event.headers.cookie : event.headers.Cookie);

  LOG('session.verify:', 'cookies=', cookies);
  if (!cookies['cobu_sessionToken']) {
    LOG('session.verify:', 'cobu_sessionToken could not be found in cookies');
    throw AuthError('invalid_session');
  }
  let token = cookies['cobu_sessionToken'];
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SESSION_KEY,
      (err, payload) => {
        if (err) {
          LOG('session.verify:', 'error validating the token', err);
          reject(AuthError('invalid_session'));
        }
        LOG('session.verify:', 'verifcation success payload=', payload);
        resolve(payload);
      });
  });
}

async function create(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.SESSION_KEY,
      { expiresIn: process.env.SESSION_EXPIRY },
      (err, token) => {
        if (err)
          reject(InternalError('create_session'));
        resolve(token);
      });
  });
}

module.exports = {
  verify,
  create
};

