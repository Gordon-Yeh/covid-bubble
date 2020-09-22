'use strict';

function LOG(...args) {
  if (process.env.STAGE === 'dev' || process.env.STAGE === 'local')
    console.log(`[${(new Date()).toISOString()}]`, ...args);
}

module.exports = {
  LOG,
}