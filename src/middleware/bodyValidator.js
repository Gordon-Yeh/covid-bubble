'use strict';

const validator = require('validator');
const { ValidationError } = require('../utils/error')

function userSignup(body) {
  body = parseBody(body);
  if (!body) {
    throw ValidationError(JSON.stringify(['invalid_body']));
  }

  let errors = [];
  if (!body.email || !validator.isEmail(body.email))
    errors.push('invalid_email');
  if (!body.firstName || !validator.isAlphanumeric(body.firstName))
    errors.push('invalid_firstname');
  if (!body.lastName || !validator.isAlphanumeric(body.lastName))
    errors.push('invalid_lastname');
  if (!body.password || body.password.length < 8)
    errors.push('invalid_password');

  if (errors.length > 0)
    throw ValidationError(JSON.stringify(errors));
  
  return sanitize(body);
}

function parseBody(body) {
  if (!body || typeof body === 'undefined' || typeof body === 'null')
    return null;
  try {
    if (typeof body === 'string')
      return JSON.parse(body);
    return body;
  } catch (e) {
    return null;
  }
}

function sanitize(obj) {
  if (typeof obj === 'string') {
    return validator.escape(obj)
  } else if (typeof obj === 'object') {
    for (let k in obj) {
      obj[k] = sanitize(obj[k]);
    }
  }
  return obj;
}

module.exports = {
  userSignup,
  sanitize
};
