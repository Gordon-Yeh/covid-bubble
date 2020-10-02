'use strict';

function LOG(...args) {
  if (process.env.STAGE === 'development')
    console.log(`[${(new Date()).toISOString()}]`, ...args);
}

module.exports = {
  LOG,
}