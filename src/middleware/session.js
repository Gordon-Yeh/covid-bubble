'use strict';

const jwt = require('jsonwebtoken');
const { AuthError, InternalError } = require('../utils/error');

async function verify(event) {
  if (!event.headers['authorization']) {
    throw AuthError('invalid_session');
  }
  // expecting format 
  // body {
  //   authorization: "Bearer [token]"
  // }
  let headerAuthParts = event.headers['authorization'].split(' ');
  if (headerAuthParts.length < 2)
    throw AuthError('invalid_session');;
  let token = headerAuthParts[1];
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

