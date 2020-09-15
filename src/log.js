'use strict';

function LOG(...args) {
  console.log(`[${(new Date()).toISOString()}]`, ...args);
}

module.exports = {
  LOG,
}