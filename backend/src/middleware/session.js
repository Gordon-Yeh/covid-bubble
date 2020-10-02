'use strict';

const jwt = require('jsonwebtoken');
const { AuthError, InternalError } = require('../utils/error');
const _cookie = require('../utils/cookies');

async function verify(event) {
  // expecting format 
  // header.cookie: "session:${jwt};"
  let cookies = _cookie.parse(event.headers.Cookie);
  if (!cookies['cobu_sessionToken']) {
    throw AuthError('invalid_session');
  }
  let token = cookies['cobu_sessionToken'];
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SESSION_KEY,
      (err, payload) => {
        if (err)
          reject(AuthError('invalid_session'));
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

