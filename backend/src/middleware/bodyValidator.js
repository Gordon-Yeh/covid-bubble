'use strict';

const validator = require('validator');
const { ValidationError } = require('../utils/error')
const { LOG } = require('../utils/log');

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
  if (!body.username || !validator.isAlphanumeric(body.username))
    errors.push('invalid_username');
  if (!body.password || body.password.length < 8)
    errors.push('invalid_password');

  if (errors.length > 0) {
    LOG('bodyValidator.userSignup()', 'errors found:', errors);
    throw ValidationError(JSON.stringify(errors));
  }
  
  return sanitize(body);
}

function login(body) {
  body = parseBody(body);
  if (!body) {
    throw ValidationError(JSON.stringify(['invalid_body']));
  }

  let errors = [];
  if (!body.email || !validator.isEmail(body.email))
    errors.push('invalid_email');
  if (!body.password || body.password.length < 8)
    errors.push('invalid_password');

  if (errors.length > 0)
    throw ValidationError(JSON.stringify(errors));
  
  return sanitize(body);
}

function addConnections(body) {
  body = parseBody(body);
  if (!body) {
    throw ValidationError(JSON.stringify(['invalid_body']));
  }

  for (let i = 0; i < body.connections.length; i++) {
    let c = body.connections[i];
    // TODO: handle case where user is connecting to themselves
    LOG('bodyValidator.addConnections():', 'checking connection:', c);
    if (!c.name || !isName(c.name))
      throw ValidationError(JSON.stringify(['invalid_connection_name']));
  }

  LOG('bodyValidator.addConnections():', 'pass validation');
  return sanitize(body);
}

function isName(name) {
  return validator.matches(name, /^[a-z0-9\s\_\-]+$/i);
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
  addConnections,
  userSignup,
  sanitize,
  login
};
