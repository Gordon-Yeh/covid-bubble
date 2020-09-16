'use strict';

const validator = require('validator');

function validUserSignup(body) {
  if (typeof body === 'string')
    body = JSON.parse(body);

  let errors = [];
  if (!validator.isEmail(body.email))
    errors.push('invalid_email');
  if (!validator.isAlphanumeric(body.firstName))
    errors.push('invalid_firstname');
  if (!validator.isAlphanumeric(body.lastName))
    errors.push('invalid_lastname');

  if (error.length > 0)
    throw new Error(JSON.stringify(errors));
  
  return sanitize(body);
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
  validUserSignup,
  sanitize
};
